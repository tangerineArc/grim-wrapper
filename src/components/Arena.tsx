"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";
import Greeting from "./Greeting";
import CustomMarkdown from "./Markdown";

export default function Arena({
  threadId,
  initialChats,
}: {
  threadId: string | null;
  initialChats: Chat[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [prompt, setPrompt] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll new chat into view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // update prompt as per textarea value
  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  // create new chat
  const handleNewChat = async () => {
    if (!prompt.trim()) {
      return;
    }

    if (!threadId) {
      console.log("No thread");
      return;
    }

    if (!session) {
      console.log("Unauthorized");
      return;
    }

    const response = await fetch("/api/ai/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model: "gemini-2.0-flash", threadId }),
    });

    const chatId = response.headers.get("X-Chat-ID");
    if (!chatId) {
      console.log("Cannot find chat ID");
      return;
    }

    const newChat: Chat = {
      id: chatId,
      prompt,
      result: "",
      threadId,
    };

    setPrompt("");
    setChats((prev) => [...prev, newChat]);

    const reader = response?.body?.getReader();
    if (!reader) {
      setChats((prev) => {
        const last = prev.at(-1);
        if (!last) return prev;

        const updatedLast = { ...last, result: "Something went wrong" };
        return [...prev.slice(0, -1), updatedLast];
      });
      return;
    }

    const decoder = new TextDecoder();

    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      result += decoder.decode(value, { stream: true });

      setChats((prev) => {
        const last = prev.at(-1);
        if (!last) return prev;

        const updatedLast = { ...last, result };
        return [...prev.slice(0, -1), updatedLast];
      });
    }

    localStorage.removeItem("threadId");
    // Redirect to thread page if still on root
    if (pathname === "/") {
      router.push(`/threads/${threadId}`);
    }
  };

  return (
    <>
      <main className="py-8 px-4 flex justify-center h-full">
        {!chats.length ? (
          <div className="px-8 flex items-center w-3xl">
            <Greeting user={session?.user} />
          </div>
        ) : (
          <div className="w-3xl space-y-16">
            {chats.map((chat, idx) => (
              <div
                key={chat.id}
                className="space-y-8"
                ref={
                  idx === chats.length - 1 && !chat.result ? bottomRef : null
                }
              >
                <div className="flex justify-end">
                  <p className="bg-secondary w-fit py-4 px-6 rounded-l-xl rounded-t-xl">
                    {chat.prompt}
                  </p>
                </div>
                <div>
                  <CustomMarkdown content={chat.result} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <div className="sticky bottom-0 bg-background rounded-b-lg">
        <ChatInput
          prompt={prompt}
          promptChangeHandler={handlePromptChange}
          newChatHandler={handleNewChat}
        />
      </div>
    </>
  );
}

type Chat = {
  id: string;
  prompt: string;
  result: string;
  threadId: string | null;
};
