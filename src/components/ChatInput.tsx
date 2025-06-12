import { ArrowUp, Globe, Paperclip } from "lucide-react";

import ModelSelector from "./ModelSelector";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";

export default function ChatInput({
  prompt,
  promptChangeHandler,
  newChatHandler,
}: ChatInputProps) {
  return (
    <div className="flex justify-center">
      <div className="max-w-3xl flex-1 pt-2 px-2 border-2 border-b-0 rounded-3xl rounded-b-none">
        <Textarea
          placeholder="Type your message here..."
          className="resize-none h-24 rounded-2xl rounded-b-none border-b-0 focus-visible:ring-0 p-4 pt-5"
          value={prompt}
          onChange={promptChangeHandler}
        />
        <div className="py-2 px-4 bg-transparent border-x-input border-x-1 flex items-center justify-between dark:bg-input/30">
          <div className="flex items-center gap-4">
            <ModelSelector />
            <Toggle>
              <Globe /> Search
            </Toggle>
            <Button variant="secondary">
              <Paperclip />
            </Button>
          </div>
          <Button onClick={newChatHandler}>
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}

type ChatInputProps = {
  prompt: string;
  promptChangeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  newChatHandler: () => Promise<void>;
};
