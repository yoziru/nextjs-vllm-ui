import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

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

const formatMessages = (messages: Message[]): Message[] => {
  return messages.map((m) => {
    if (m.role === "system") {
      return { role: "system", content: m.content } as Message;
    } else if (m.role === "user") {
      return { role: "user", content: m.content } as Message;
    } else {
      return { role: "assistant", content: m.content } as Message;
    }
  });
};

export async function POST(req: NextRequest) {
  try {
    const { messages, chatOptions } = await req.json();
    if (!chatOptions.selectedModel || chatOptions.selectedModel === "") {
      throw new Error("Selected model is required");
    }

    const baseUrl = process.env.VLLM_URL;
    if (!baseUrl) {
      throw new Error("VLLM_URL is not set");
    }
    const formattedMessages = formatMessages(
      addSystemMessage(messages, chatOptions.systemPrompt)
    );

    const stream = await getOpenAIStream(
      baseUrl,
      chatOptions.selectedModel,
      formattedMessages,
      chatOptions.temperature
    );
    return new NextResponse(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
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

const getOpenAIStream = async (
  apiUrl: string,
  model: string,
  messages: Message[],
  temperature?: number,
  apiKey?: string
) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (apiKey !== undefined) {
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("api-key", apiKey);
  }
  const res = await fetch(apiUrl + "/v1/chat/completions",{
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      model: model,
      // frequency_penalty: 0,
      // max_tokens: 2000,
      messages: messages,
      // presence_penalty: 0,
      stream: true,
      temperature: temperature ?? 0.5,
      // top_p: 0.95,
    }),
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    const responseBody = await res.text();
    console.error(`vLLM API response error: ${responseBody}`);
    throw new Error(
      `The vLLM API has encountered an error with a status code of ${res.status} ${statusText}: ${responseBody}`
    );
  }

  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        // An extra newline is required to make AzureOpenAI work.
        const str = decoder.decode(chunk).replace("[DONE]\n", "[DONE]\n\n");
        parser.feed(str);
      }
    },
  });
};
