import { NextRequest, NextResponse } from "next/server";

import { ChatOptions } from "@/components/chat/chat-options";
import { resolveLlmConfig } from "@/lib/server-llm-config";

function settingsResponse(chatOptions?: Partial<ChatOptions>) {
  const llmConfig = resolveLlmConfig(chatOptions);
  return NextResponse.json(
    {
      provider: llmConfig.provider,
      providerLabel: llmConfig.providerLabel,
      tokenLimit: llmConfig.tokenLimit,
    },
    { status: 200 }
  );
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return settingsResponse();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  return settingsResponse(body.chatOptions);
}
