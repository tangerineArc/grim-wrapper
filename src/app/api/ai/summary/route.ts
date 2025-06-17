import { NextResponse, NextRequest } from "next/server";

import { summarize } from "@/lib/ai/summary";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { threadId } = body;
}
