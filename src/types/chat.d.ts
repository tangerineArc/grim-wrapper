export type Chat = {
  id: string;
  prompt: string;
  result: string;
  threadId: string | null;
};

export type Thread = {
  id: string;
  title: string;
  chats: Chat[];
}

export type Memory = {
  role: "user" | "assistant" | "system";
  content: string;
}
