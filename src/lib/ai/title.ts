import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

export async function generateTitle(modelName: string, prompt: string) {
  const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const { text } = await generateText({
    model: openRouter(modelName),
    prompt: `Give a short descriptive title (max 4 words) for this chat prompt:\n\n\"${prompt}\"\n\nNote: Return only the title. No explanation or quotes.`,
    maxTokens: 40,
  });

  return text;
}
