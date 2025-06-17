"use client";

import type { Chat } from "@/types/chat";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import Greeting from "./Greeting";

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
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [prompt, setPrompt] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll new chat into view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // update prompt as per textarea value
  const handlePromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(event.target.value);
    },
    []
  );

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

    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        model: "google/gemini-2.0-flash-exp:free",
        threadId,
      }),
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
    setCurrentChat(newChat);

    const reader = response?.body?.getReader();
    if (!reader) {
      setChats((prev) => [
        ...prev,
        { ...newChat, result: "Something went wrong" },
      ]);
      return;
    }

    const decoder = new TextDecoder();
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      result += decoder.decode(value, { stream: true });
      setCurrentChat({ ...newChat, result });
    }
    result += decoder.decode(); // flush the buffer
    setChats((prev) => [...prev, { ...newChat, result }]);
    setCurrentChat(null);

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
            {chats.map((chat) => (
              <ChatBubble chat={chat} key={chat.id} />
            ))}
            {currentChat && <ChatBubble chat={currentChat} ref={bottomRef} />}
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
