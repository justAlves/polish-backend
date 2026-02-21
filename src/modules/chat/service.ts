import { prisma } from "../../config/prisma";
import { transcribe, chatCompletion } from "../../services/groq";
import { synthesize } from "../../services/tts";

const LANGUAGE_INFO: Record<string, { nativeName: string; flag: string }> = {
  en: { nativeName: "English", flag: "🇺🇸" },
  es: { nativeName: "Español", flag: "🇪🇸" },
  fr: { nativeName: "Français", flag: "🇫🇷" },
  de: { nativeName: "Deutsch", flag: "🇩🇪" },
  it: { nativeName: "Italiano", flag: "🇮🇹" },
  pt: { nativeName: "Português", flag: "🇧🇷" },
  ja: { nativeName: "日本語", flag: "🇯🇵" },
  zh: { nativeName: "中文", flag: "🇨🇳" },
  ko: { nativeName: "한국어", flag: "🇰🇷" },
};

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}h${minutes}`;

  if (dateOnly.getTime() === today.getTime()) return `Hoje, ${time}`;
  if (dateOnly.getTime() === yesterday.getTime()) return `Ontem, ${time}`;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}, ${time}`;
}

function formatDuration(start: Date, end: Date): string {
  const minutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
  return `${minutes} min`;
}

export abstract class ChatService {
  static async createConversation(language: string, userId: string) {
    return prisma.conversation.create({
      data: { language, userId },
    });
  }

  static async listConversations(userId?: string) {
    const rows = await prisma.conversation.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { updatedAt: "desc" },
    });

    return rows.map((c) => {
      const info = LANGUAGE_INFO[c.language] ?? { nativeName: c.language, flag: "🌐" };
      return {
        id: c.id,
        language: info.nativeName,
        nativeName: info.nativeName,
        flag: info.flag,
        date: formatDate(c.updatedAt),
        duration: formatDuration(c.createdAt, c.updatedAt),
      };
    });
  }

  static async getConversation(id: string, userId?: string) {
    return prisma.conversation.findFirst({
      where: { id, userId },
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
