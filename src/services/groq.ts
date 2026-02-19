import Groq from "groq-sdk";

let _groq: Groq;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: `You are a friendly native English speaker on a casual phone call.
Reply ONLY in English. Keep it natural and concise (1-3 sentences).
If the user makes mistakes, just continue the conversation naturally.`,
  es: `Eres un hablante nativo de español en una llamada telefónica casual.
Responde SOLO en español. Sé natural y conciso (1-3 oraciones).
Si el usuario comete errores, simplemente continúa la conversación.`,
  fr: `Tu es un locuteur natif français dans un appel téléphonique décontracté.
Réponds UNIQUEMENT en français. Sois naturel et concis (1-3 phrases).
Si l'utilisateur fait des erreurs, continue simplement la conversation.`,
  de: `Du bist ein deutscher Muttersprachler in einem lockeren Telefonat.
Antworte NUR auf Deutsch. Sei natürlich und kurz (1-3 Sätze).
Wenn der Benutzer Fehler macht, führe das Gespräch einfach weiter.`,
  it: `Sei un madrelingua italiano in una telefonata informale.
Rispondi SOLO in italiano. Sii naturale e conciso (1-3 frasi).
Se l'utente fa errori, continua semplicemente la conversazione.`,
  pt: `Você é um falante nativo de português em uma ligação telefônica casual.
Responda SOMENTE em português. Seja natural e conciso (1-3 frases).
Se o usuário cometer erros, simplesmente continue a conversa.`,
  ja: `あなたはカジュアルな電話をしている日本語のネイティブスピーカーです。
日本語のみで返答してください。自然で簡潔に（1〜3文）。
ユーザーが間違えても、自然に会話を続けてください。`,
  ko: `당신은 캐주얼한 전화 통화를 하고 있는 한국어 원어민입니다.
한국어로만 대답하세요. 자연스럽고 간결하게 (1-3문장).
사용자가 실수를 해도 자연스럽게 대화를 계속하세요.`,
  zh: `你是一个正在进行轻松电话交谈的中文母语者。
只用中文回复。保持自然简洁（1-3句话）。
如果用户犯了错误，请自然地继续对话。`,
};

export async function transcribe(
  audioBuffer: Buffer,
  mimeType: string,
  language?: string,
): Promise<string> {
  const ext = mimeType.includes("webm")
    ? "webm"
    : mimeType.includes("mp4") || mimeType.includes("m4a")
      ? "m4a"
      : "wav";

  const file = new File([audioBuffer], `audio.${ext}`, { type: mimeType });

  const transcription = await getGroq().audio.transcriptions.create({
    file,
    model: "whisper-large-v3",
    response_format: "text",
    ...(language && { language }),
  });

  return transcription as unknown as string;
}

export async function chatCompletion(
  messages: { role: "user" | "assistant"; content: string }[],
  language: string,
): Promise<string> {
  const systemPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS["en"];

  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}
