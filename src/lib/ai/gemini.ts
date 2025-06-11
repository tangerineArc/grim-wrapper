import { GoogleGenAI } from "@google/genai";

export async function gemini(model: GeminiModel, prompt: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "text/plain",
  };
  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  return response;
}

type GeminiModel = "gemini-2.0-flash" | "gemini-2.0-flash-lite";
