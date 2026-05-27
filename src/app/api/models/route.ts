import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const baseUrl = process.env.VLLM_URL;
  const apiKey = process.env.VLLM_API_KEY;
  const headers = new Headers();
  if (apiKey !== undefined) {
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("api-key", apiKey);
  }

  const envModel = process.env.VLLM_MODEL;
  if (envModel) {
    return NextResponse.json({
      object: "list",
      data: [
        {
          id: envModel,
        },
      ],
    });
  }

  if (!baseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "VLLM_URL is not set",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(`${baseUrl}/v1/models`, {
      headers: headers,
      cache: "no-store",
    });
    if (res.status !== 200) {
      const statusText = res.statusText;
      const responseBody = await res.text();
      console.error(`vLLM /api/models response error: ${responseBody}`);
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
