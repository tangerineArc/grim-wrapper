import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const thread = await prisma.thread.create({
    data: { userId: session.user.id, title: "New chat" },
  });

  return NextResponse.json({ id: thread.id });
}
