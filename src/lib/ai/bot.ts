import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function bot(
  modelName: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[]
) {
  const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const { textStream } = streamText({
    model: openRouter(modelName),
    temperature: 0.5,
    messages,
  });

  return textStream;
}
