import { StreamingTextResponse, Message } from "ai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";

const addSystemMessage = (messages: Message[], systemPrompt?: string) => {
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
        id: "1",
        content: systemPrompt,
        role: "system",
      },
    ];
  } else if (messages.length === 0) {
    // if there are no messages, add the system prompt as the first message
    messages.push({
      id: "1",
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
        id: "1",
        content: systemPrompt,
        role: "system",
      });
    }
  }
  return messages;
};

const formatMessages = (messages: Message[]) => {
  return messages.map((m) => {
    if (m.role === "system") {
      return new SystemMessage(m.content);
    } else if (m.role === "user") {
      return new HumanMessage(m.content);
    } else {
      return new AIMessage(m.content);
    }
  });
};

export async function POST(req: NextRequest) {
  const { messages, chatOptions } = await req.json();
  if (!chatOptions.selectedModel || chatOptions.selectedModel === "") {
    throw new Error("Selected model is required");
  }

  const baseUrl = process.env.VLLM_URL + "/v1";
  const model = new ChatOpenAI({
    openAIApiKey: "foo",
    configuration: {
      baseURL: baseUrl,
    },
    modelName: chatOptions.selectedModel,
    temperature: chatOptions.temperature,
  });

  const parser = new BytesOutputParser();
  const formattedMessages = formatMessages(
    addSystemMessage(messages, chatOptions.systemPrompt)
  );
  try {
    const stream = await model.pipe(parser).stream(formattedMessages);
    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
