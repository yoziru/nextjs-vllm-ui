import { CoreMessage, Message } from "ai";
import llama3Tokenizer from "llama3-tokenizer-js";

const DEFAULT_TOKEN_LIMIT = 4096;

export const getTokenLimit = async (basePath: string): Promise<number> => {
  try {
    const res = await fetch(basePath + "/api/settings");

    if (!res.ok) {
      console.error(`Failed to fetch settings: ${res.status} ${res.statusText}`);
      return DEFAULT_TOKEN_LIMIT;
    }
    const data = await res.json();
    return data.tokenLimit ?? DEFAULT_TOKEN_LIMIT;
  } catch (error) {
    console.error("Failed to fetch token limit:", error);
    return DEFAULT_TOKEN_LIMIT;
  }
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
