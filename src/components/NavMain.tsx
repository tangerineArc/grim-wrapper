"use client";

import { MoreHorizontal, Pin, TextCursorInput, Trash2 } from "lucide-react";
import Link from "next/link";

import { useThreads } from "./providers/ThreadsProvider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

export default function NavMain({
  selectedThread,
}: {
  selectedThread: string | null;
}) {
  const { isMobile } = useSidebar();
  const { threads } = useThreads();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Threads</SidebarGroupLabel>
      <SidebarMenu>
        {threads.map((thread) => (
          <SidebarMenuItem key={thread.id}>
            <SidebarMenuButton
              isActive={thread.id === selectedThread}
              size="sm"
            >
              <Link
                href={`/threads/${thread.id}`}
                className="truncate block w-full text-left"
              >{`${thread.title}`}</Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                className="min-w-32 rounded-lg ml-2"
              >
                <DropdownMenuItem>
                  <Pin className="text-muted-foreground" /> <span>Pin</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TextCursorInput className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// export default memo(NavMain);

// type Thread = {
//   id: string;
//   title: string;
//   createdAt: Date;
// };
