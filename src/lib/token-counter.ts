import { CoreMessage, Message } from "ai";
import llama3Tokenizer from "llama3-tokenizer-js";

import { ChatOptions } from "@/components/chat/chat-options";

export const getTokenLimit = async (basePath: string, chatOptions?: ChatOptions) => {
  const res = await fetch(basePath + "/api/settings", {
    method: chatOptions ? "POST" : "GET",
    headers: chatOptions ? { "Content-Type": "application/json" } : undefined,
    body: chatOptions ? JSON.stringify({ chatOptions }) : undefined,
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    const errorMessage = `Connection to model server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
    throw new Error(errorMessage);
  }
  const data = await res.json();
  return data.tokenLimit;
};

export const encodeChat = (messages: Message[] | CoreMessage[]): number => {
  const tokensPerMessage = 3;
  let numTokens = 0;
  for (const message of messages) {
    numTokens += tokensPerMessage;
    numTokens += llama3Tokenizer.encode(message.role).length;
    if (typeof message.content === "string") {
      numTokens += llama3Tokenizer.encode(message.content).length;
    }
  }
  numTokens += 3;
  return numTokens;
};
