import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function bot(modelName: string, prompt: string) {
  const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const { textStream } = streamText({
    model: openRouter(modelName),
    prompt,
  });

  return textStream;
}
