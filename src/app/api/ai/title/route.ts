import { NextResponse, NextRequest } from "next/server";
import { getSession } from "next-auth/react";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized",  { status: 401 });

  const body = await req.json();
  const { prompt, model, threadId } = body;

}
