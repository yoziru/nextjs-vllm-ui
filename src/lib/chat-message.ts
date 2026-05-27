import { UIMessage } from "ai";

export type ChatMessage = UIMessage & {
  content?: string;
  createdAt?: string | Date;
};

export const getMessageContent = (message: ChatMessage): string => {
  if (message.content !== undefined) {
    return message.content;
  }

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
};

