import { prisma } from "../../config/prisma";
import { transcribe, chatCompletion } from "../../services/groq";
import { synthesize } from "../../services/tts";

export abstract class ChatService {
  static async createConversation(language: string) {
    return prisma.conversation.create({
      data: { language },
    });
  }

  static async listConversations() {
    return prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  static async getConversation(id: string) {
    return prisma.conversation.findFirst({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  static async sendMessage(conversationId: string, language: string, messages: { role: string; content: string }[], audio: File) {
    // 1. STT — transcrever áudio do usuário
    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const userText = await transcribe(audioBuffer, audio.type, language);

    // 2. Salvar mensagem do usuário
    await prisma.message.create({
      data: { conversationId, role: "user", content: userText },
    });

    // 3. LLM — gerar resposta
    const history = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
    history.push({ role: "user", content: userText });

    const assistantText = await chatCompletion(history, language);

    // 4. Salvar mensagem da IA
    await prisma.message.create({
      data: { conversationId, role: "assistant", content: assistantText },
    });

    // 5. TTS — converter resposta em áudio
    const audioResponse = await synthesize(assistantText, language);

    return {
      userTranscription: userText,
      text: assistantText,
      audio: audioResponse.toString("base64"),
    };
  }
}
