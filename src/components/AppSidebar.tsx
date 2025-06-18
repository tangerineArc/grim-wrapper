"use client";

import { LogIn, Target } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

import NavActions from "./NavActions";
import NavMain from "./NavMain";
import NavUser from "./NavUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const params = useParams();
  const selectedThread =
    typeof params.threadId === "string" ? params.threadId : null;

  // const [threads, setThreads] = useState<Thread[]>([]);

  // const fetchThreads = async () => {
  //   const res = await fetch("/api/threads");
  //   if (!res.ok) return;

  //   const data: Thread[] = await res.json();
  //   setThreads(data);
  // };

  // useEffect(() => {
  //   fetchThreads();
  // }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Target />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Grim Wrapper</span>
                  <span className="">v0.0.1</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavActions />
        <NavMain selectedThread={selectedThread} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {session ? (
                <NavUser user={session?.user} />
              ) : (
                <Link href="/auth/signin">
                  <LogIn className="size-4" />
                  Login
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// type Thread = {
//   id: string;
//   title: string;
//   createdAt: Date;
// };
