import { Message } from "ai";
import mistralTokenizer from "mistral-tokenizer-js";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const tokenLimit = process.env.NEXT_PUBLIC_TOKEN_LIMIT ? parseInt(process.env.NEXT_PUBLIC_TOKEN_LIMIT) : 4096;

export const encodeChat = (
  messages: Message[] | ChatCompletionMessageParam[]
): number => {
  const tokensPerMessage = 3;
  let numTokens = 0;
  for (const message of messages) {
    numTokens += tokensPerMessage;
    numTokens += mistralTokenizer.encode(message.role).length;
    if (typeof message.content === "string") {
      numTokens += mistralTokenizer.encode(message.content).length;
    }
  }
  numTokens += 3;
  return numTokens;
};
