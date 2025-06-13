import { NextResponse, NextRequest } from "next/server";

import { gemini } from "@/lib/ai/gemini";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { prompt, model } = body;

  const chat = await prisma.chat.create({
    data: { prompt, userId: session.user.id },
  });

  const response = await gemini(model, prompt);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let output = "";
        for await (const chunk of response) {
          output += chunk.text;

          await prisma.chat.update({
            where: { id: chat.id },
            data: { result: output },
          });

          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "X-Chat-ID": chat.id,
    },
  });
}
