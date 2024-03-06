import { StreamingTextResponse, Message } from "ai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

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

export async function POST(req: Request) {
  const { messages, selectedModel } = await req.json();

  const baseUrl = process.env.VLLM_URL + "/v1";
  const model = new ChatOpenAI({
    openAIApiKey: "foo",
    configuration: {
      baseURL: baseUrl,
    },
    modelName: selectedModel,
  });

  const parser = new BytesOutputParser();
  const stream = await model.pipe(parser).stream(formatMessages(messages));

  return new StreamingTextResponse(stream);
}
