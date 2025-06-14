import AppSidebar from "@/components/AppSidebar";
import Arena from "@/components/Arena";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string };
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
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10 rounded-t-lg">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {thread && <Arena threadId={threadId} initialChats={thread.chats} />}
      </SidebarInset>
    </SidebarProvider>
  );
}
