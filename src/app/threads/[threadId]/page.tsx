import Arena from "@/components/Arena";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const session = await getSession();

  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: { chats: { orderBy: { createdAt: "asc" } } },
  });

  if (!thread || thread.userId !== session?.user.id) {
    return <p>Thread not found or access denied</p>;
  }

  return (
    <>
      <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10 rounded-t-lg">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-sm text-muted-foreground">{thread.title}</span>
      </header>
      <Arena threadId={threadId} initialChats={thread.chats} />
    </>
  );
}
