import { NextResponse, NextRequest } from "next/server";

import { gemini } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, model } = body;

  const response = await gemini(model, prompt);

  const stream = new ReadableStream({
    async pull(controller) {
      try {
        for await (const chunk of response) {
          controller.enqueue(new TextEncoder().encode(chunk.text));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}
