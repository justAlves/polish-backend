import OpenAI from "openai";

let _openai: OpenAI;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const LANGUAGE_VOICES: Record<string, string> = {
  en: "alloy",
  es: "nova",
  fr: "shimmer",
  de: "onyx",
  it: "nova",
  pt: "nova",
  ja: "alloy",
  ko: "alloy",
  zh: "alloy",
};

export async function synthesize(
  text: string,
  language?: string,
): Promise<Buffer> {
  const voice = (language && LANGUAGE_VOICES[language]) || "alloy";

  const response = await getOpenAI().audio.speech.create({
    model: "tts-1",
    voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
    input: text,
    response_format: "mp3",
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
