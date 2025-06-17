import { GoogleGenAI } from "@google/genai";

export async function summarize(conversations: any) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "text/plain",
  };
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
Summarize the following conversation as bullet points that preserve:

- The user's main questions or goals
- The AI's key responses or suggestions
- Any actions, conclusions, or unresolved issues

Be concise but accurate. This will be reused as compressed memory for a future chat.

Conversation:
${conversations}
      `,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config,
    contents,
  });

  return response;
}
