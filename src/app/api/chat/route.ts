import {
  streamText,
  CoreMessage,
  CoreUserMessage,
  CoreSystemMessage,
  CoreAssistantMessage,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

import { NextRequest, NextResponse } from "next/server";

import { encodeChat } from "@/lib/token-counter";

const addSystemMessage = (messages: CoreMessage[], systemPrompt?: string) => {
  // early exit if system prompt is empty
  if (!systemPrompt || systemPrompt === "") {
    return messages;
  }

  // add system prompt to the chat (if it's not already there)
  // check first message in the chat
  if (!messages) {
    // if there are no messages, add the system prompt as the first message
    messages = [
      {
        content: systemPrompt,
        role: "system",
      },
    ];
  } else if (messages.length === 0) {
    // if there are no messages, add the system prompt as the first message
    messages.push({
      content: systemPrompt,
      role: "system",
    });
  } else {
    // if there are messages, check if the first message is a system prompt
    if (messages[0].role === "system") {
      // if the first message is a system prompt, update it
      messages[0].content = systemPrompt;
    } else {
      // if the first message is not a system prompt, add the system prompt as the first message
      messages.unshift({
        content: systemPrompt,
        role: "system",
      });
    }
  }
  return messages;
};

const formatMessages = (
  messages: CoreMessage[],
  tokenLimit: number = 4096
): CoreMessage[] => {
  let mappedMessages: CoreMessage[] = [];
  let messagesTokenCounts: number[] = [];
  const reservedResponseTokens = 512;

  const tokenLimitRemaining = tokenLimit - reservedResponseTokens;
  let tokenCount = 0;

  messages.forEach((m) => {
    if (m.role === "system") {
      mappedMessages.push({
        role: "system",
        content: m.content,
      } as CoreSystemMessage);
    } else if (m.role === "user") {
      mappedMessages.push({
        role: "user",
        content: m.content,
      } as CoreUserMessage);
    } else if (m.role === "assistant") {
      mappedMessages.push({
        role: "assistant",
        content: m.content,
      } as CoreAssistantMessage);
    } else {
      return;
    }

    // ignore typing
    // tslint:disable-next-line
    const messageTokens = encodeChat([m]);
    messagesTokenCounts.push(messageTokens);
    tokenCount += messageTokens;
  });

  if (tokenCount <= tokenLimitRemaining) {
    return mappedMessages;
  }

  // remove the middle messages until the token count is below the limit
  while (tokenCount > tokenLimitRemaining) {
    const middleMessageIndex = Math.floor(messages.length / 2);
    const middleMessageTokens = messagesTokenCounts[middleMessageIndex];
    mappedMessages.splice(middleMessageIndex, 1);
    messagesTokenCounts.splice(middleMessageIndex, 1);
    tokenCount -= middleMessageTokens;
  }
  return mappedMessages;
};

export async function POST(req: Request) {
  // export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { messages, chatOptions } = await req.json();
    if (!chatOptions.selectedModel || chatOptions.selectedModel === "") {
      throw new Error("Selected model is required");
    }

    const baseUrl = process.env.VLLM_URL;
    if (!baseUrl) {
      throw new Error("VLLM_URL is not set");
    }
    const apiKey = process.env.VLLM_API_KEY;

    const tokenLimit = process.env.VLLM_TOKEN_LIMIT
      ? parseInt(process.env.VLLM_TOKEN_LIMIT)
      : 4096;

    const formattedMessages = formatMessages(
      addSystemMessage(messages, chatOptions.systemPrompt),
      tokenLimit
    );

    // Call the language model
    const customOpenai = createOpenAI({
      baseUrl: baseUrl + "/v1",
      apiKey: apiKey ?? "",
    });

    const result = await streamText({
      model: customOpenai(chatOptions.selectedModel),
      messages: formattedMessages,
      temperature: chatOptions.temperature,
      // async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      //   // implement your own logic here, e.g. for storing messages
      //   // or recording token usage
      // },
    });

    // Respond with the stream
    return result.toAIStreamResponse();

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
