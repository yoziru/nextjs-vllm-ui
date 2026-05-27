import { CoreMessage } from "ai";
import llama3Tokenizer from "llama3-tokenizer-js";

import { ChatMessage, getMessageContent } from "@/lib/chat-message";

const DEFAULT_TOKEN_LIMIT = 4096;

export const getTokenLimit = async (basePath: string): Promise<number> => {
  try {
    const res = await fetch(basePath + "/api/settings");

    if (!res.ok) {
      return DEFAULT_TOKEN_LIMIT;
    }

    const data: { tokenLimit?: unknown } = await res.json();
    return typeof data.tokenLimit === "number"
      ? data.tokenLimit
      : DEFAULT_TOKEN_LIMIT;
  } catch (error) {
    return DEFAULT_TOKEN_LIMIT;
  }
};

export const encodeChat = (messages: ChatMessage[] | CoreMessage[]): number => {
  const tokensPerMessage = 3;
  let numTokens = 0;
  for (const message of messages) {
    numTokens += tokensPerMessage;
    numTokens += llama3Tokenizer.encode(message.role).length;
    const content =
      "parts" in message ? getMessageContent(message) : message.content;
    if (typeof content === "string") {
      numTokens += llama3Tokenizer.encode(content).length;
    }
  }
  numTokens += 3;
  return numTokens;
};
