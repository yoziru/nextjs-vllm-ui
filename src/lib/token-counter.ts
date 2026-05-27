import { CoreMessage } from "ai";
import llama3Tokenizer from "llama3-tokenizer-js";

import { ChatMessage, getMessageContent } from "@/lib/chat-message";

export const getTokenLimit = async (basePath: string) => {
  const res = await fetch(basePath + "/api/settings");

  if (!res.ok) {
    const errorResponse = await res.json();
    const errorMessage = `Connection to vLLM server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
    throw new Error(errorMessage);
  }
  const data = await res.json();
  return data.tokenLimit;
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
