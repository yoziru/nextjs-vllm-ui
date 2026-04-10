import { NextRequest, NextResponse } from "next/server";

import { ChatOptions } from "@/components/chat/chat-options";
import { getProviderHeaders, resolveLlmConfig } from "@/lib/server-llm-config";

async function fetchModels(chatOptions?: Partial<ChatOptions>): Promise<NextResponse> {
  const llmConfig = resolveLlmConfig(chatOptions);

  if (llmConfig.model) {
    return NextResponse.json({
      object: "list",
      data: [
        {
          id: llmConfig.model,
        },
      ],
    });
  }

  try {
    const res = await fetch(`${llmConfig.openAIBaseUrl}/models`, {
      headers: getProviderHeaders(llmConfig.apiKey),
      cache: "no-store",
    });
    if (res.status !== 200) {
      const statusText = res.statusText;
      const responseBody = await res.text();
      console.error(`${llmConfig.provider} /api/models response error: ${responseBody}`);
      return NextResponse.json(
        {
          success: false,
          error: statusText,
        },
        { status: res.status }
      );
    }
    return new NextResponse(res.body, res);
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  return fetchModels();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  return fetchModels(body.chatOptions);
}
