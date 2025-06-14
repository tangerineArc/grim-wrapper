import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const existingEmptyThread = await prisma.thread.findFirst({
    where: { userId: session.user.id, chats: { none: {} } },
  });

  if (existingEmptyThread) {
    return NextResponse.json({ id: existingEmptyThread.id });
  }

  const thread = await prisma.thread.create({
    data: { userId: session.user.id, title: "New chat" },
  });

  return NextResponse.json({ id: thread.id });
}

export async function GET() {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const threads = await prisma.thread.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(threads);
}
