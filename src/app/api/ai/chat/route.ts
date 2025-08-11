import type { Memory } from "@/types/chat";

import { NextResponse, NextRequest } from "next/server";

import { bot } from "@/lib/ai/bot";
import { embed } from "@/lib/ai/embed";
import { generateTitle } from "@/lib/ai/title";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_CONTEXT_MESSAGES = 12;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { prompt, model, threadId, shouldGenerateTitle } = body;

  if (shouldGenerateTitle) {
    const title = await generateTitle(model, prompt);
    await prisma.thread.update({ where: { id: threadId }, data: { title } });
  }

  // create chat record
  const chat = await prisma.chat.create({
    data: { prompt, userId: session.user.id, threadId },
  });

  // embed prompt and store in memory
  const userEmbedding = await embed(prompt);
  await prisma.$executeRaw`
    INSERT INTO "Memory" ("threadId", role, content, embedding)
    VALUES (${threadId}, 'USER', ${prompt}, ${userEmbedding}::vector)
  `;

  // fetch relevant memory for this thread
  const relevantMemories: Memory[] = await prisma.$queryRawUnsafe(`
    SELECT role, content
    FROM "Memory"
    WHERE "threadId" = $1
    ORDER BY embedding <=> $2::vector
    LIMIT ${MAX_CONTEXT_MESSAGES}
  `, threadId, userEmbedding);

  // build prompt for LLM
  const messages = relevantMemories.map(m => ({
    role: m.role.toLowerCase(),
    content: m.content,
  }));
  messages.push({ role: "user", content: prompt });

  // call the LLM
  const textStream = await bot(model, messages as Memory[]);
  const [clientStream, dbStream] = textStream.tee();

  // save chat in the background
  saveStreamToDB(dbStream, chat.id, threadId);

  return new NextResponse(clientStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "X-Chat-ID": chat.id,
    },
  });
}

async function saveStreamToDB(
  stream: ReadableStream,
  chatId: string,
  threadId: string,
) {
  const reader = stream.getReader();
  let output = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    output += value;
  }

  // store assistant reply
  await prisma.chat.update({
    where: { id: chatId },
    data: { result: output },
  });

  // embed reply and store in memory
  const assistantEmbedding = await embed(output);
  await prisma.$executeRaw`
    INSERT INTO "Memory" ("threadId", role, content, embedding)
    VALUES (${threadId}, 'ASSISTANT', ${output}, ${assistantEmbedding}::vector)
  `;
}
