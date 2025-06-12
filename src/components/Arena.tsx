"use client";

import type { Chat } from "@/types/chat";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";
import Greeting from "./Greeting";
import CustomMarkdown from "./Markdown";

export default function Arena() {
  const { data: session } = useSession();

  const [chats, setChats] = useState<Chat[]>([]);
  const [prompt, setPrompt] = useState("");

  const frameRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleNewChat = async () => {
    const response = await fetch("/api/ai/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model: "gemini-2.0-flash" }),
    });

    const chat: Chat = { id: new Date().toString(), prompt, result: "" };

    setPrompt("");
    setChats((prev) => [...prev, chat]);

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

      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(() => {
          setChats((prev) => {
            const last = prev.at(-1);
            if (!last) return prev;

            const updatedLast = { ...last, result };

            frameRef.current = null;

            return [...prev.slice(0, -1), updatedLast];
          });
        });
      }
    }
  };

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
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
                  <p className="bg-neutral-800 w-fit py-4 px-6 rounded-l-xl rounded-t-xl">
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
