import { StreamingTextResponse, Message } from "ai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

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

  const stream = await model
    .pipe(parser)
    .stream(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      )
    );

  return new StreamingTextResponse(stream);
}
