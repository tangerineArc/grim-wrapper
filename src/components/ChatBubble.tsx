import type { Chat } from "@/types/chat";

import { memo } from "react";

import CustomMarkdown from "./Markdown";

import { Skeleton } from "@/components/ui/skeleton";

const ChatBubble = ({
  chat,
  isLoading = false,
}: {
  chat: Chat;
  isLoading?: boolean;
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <p className="bg-secondary w-fit py-4 px-6 rounded-l-xl rounded-t-xl">
          {chat.prompt}
        </p>
      </div>
      <div>
        {isLoading && (
          <div className="flex gap-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
        )}
        <CustomMarkdown content={chat.result} />
      </div>
    </div>
  );
};

export default memo(ChatBubble);
