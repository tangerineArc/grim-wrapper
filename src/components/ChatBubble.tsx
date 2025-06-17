import type { Chat } from "@/types/chat";

import { memo } from "react";

import CustomMarkdown from "./Markdown";

const ChatBubble = ({ chat }: { chat: Chat }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <p className="bg-secondary w-fit py-4 px-6 rounded-l-xl rounded-t-xl">
          {chat.prompt}
        </p>
      </div>
      <div>
        <CustomMarkdown content={chat.result} />
      </div>
    </div>
  );
};

export default memo(ChatBubble);
