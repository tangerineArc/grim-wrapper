import { NextResponse, NextRequest } from "next/server";

import { bot } from "@/lib/ai/bot";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { prompt, model, threadId } = body;

  const chat = await prisma.chat.create({
    data: { prompt, userId: session.user.id, threadId },
  });

  const response = await bot(model, prompt);

  const [clientStream, dbStream] = response.tee();

  // save chat in the background -> coolest thing ever
  saveStreamToDB(dbStream, chat.id);

  return new NextResponse(clientStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "X-Chat-ID": chat.id,
    },
  });
}

async function saveStreamToDB(stream: ReadableStream, chatId: string) {
  const reader = stream.getReader();
  let output = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    output += value;
  }

  await prisma.chat.update({
    where: { id: chatId },
    data: { result: output },
  });
}
