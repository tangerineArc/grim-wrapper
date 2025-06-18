"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Arena from "@/components/Arena";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const existingThreadId = localStorage.getItem("threadId");

    if (existingThreadId) {
      if (!window.location.pathname.includes(existingThreadId)) {
        router.replace(`/threads/${existingThreadId}`);
      }
    } else {
      // avoid firing twice on re-renders
      let didCreate = false;

      const createThread = async () => {
        if (didCreate) return;
        didCreate = true;

        const res = await fetch("/api/threads", { method: "POST" });
        const data = await res.json();

        localStorage.setItem("threadId", data.id);
        setThreadId(data.id);
      };

      createThread();
    }
  }, [status, router]);

  return (
    <>
      <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10 rounded-t-lg">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-sm text-muted-foreground">New thread</span>
      </header>
      <Arena threadId={threadId} initialChats={[]} />
    </>
  );
}
