import { ChatOptions } from "@/components/chat/chat-options";
import {
  defaultProviderBaseUrls,
  LlmProvider,
  normalizeBaseUrl,
  toOpenAIBaseUrl,
} from "@/lib/llm-providers";

export interface LlmConfig {
  provider: LlmProvider;
  baseUrl: string;
  openAIBaseUrl: string;
  apiKey?: string;
  model?: string;
  tokenLimit: number;
}

const providerEnv = {
  vllm: {
    url: "VLLM_URL",
    apiKey: "VLLM_API_KEY",
    model: "VLLM_MODEL",
    tokenLimit: "VLLM_TOKEN_LIMIT",
  },
  ollama: {
    url: "OLLAMA_URL",
    apiKey: "OLLAMA_API_KEY",
    model: "OLLAMA_MODEL",
    tokenLimit: "OLLAMA_TOKEN_LIMIT",
  },
  openai: {
    url: "OPENAI_URL",
    apiKey: "OPENAI_API_KEY",
    model: "OPENAI_MODEL",
    tokenLimit: "OPENAI_TOKEN_LIMIT",
  },
  custom: {
    url: "CUSTOM_OPENAI_URL",
    apiKey: "CUSTOM_OPENAI_API_KEY",
    model: "CUSTOM_OPENAI_MODEL",
    tokenLimit: "CUSTOM_OPENAI_TOKEN_LIMIT",
  },
} satisfies Record<
  LlmProvider,
  { url: string; apiKey: string; model: string; tokenLimit: string }
>;

function readNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveLlmConfig(chatOptions?: Partial<ChatOptions>): LlmConfig {
  const provider = chatOptions?.provider ?? "vllm";
  const env = providerEnv[provider];
  const baseUrl =
    chatOptions?.apiBaseUrl ||
    process.env[env.url] ||
    (provider === "ollama" ? process.env.VLLM_URL : undefined) ||
    defaultProviderBaseUrls[provider];

  if (!baseUrl) {
    throw new Error(`${env.url} is not set`);
  }

  const apiKey = chatOptions?.apiKey || process.env[env.apiKey];
  const model = chatOptions?.selectedModel || process.env[env.model];
  const tokenLimit = readNumber(
    process.env[env.tokenLimit] || process.env.VLLM_TOKEN_LIMIT,
    4096
  );

  return {
    provider,
    baseUrl: normalizeBaseUrl(baseUrl),
    openAIBaseUrl: toOpenAIBaseUrl(baseUrl),
    apiKey,
    model,
    tokenLimit,
  };
}

export function getProviderHeaders(apiKey?: string) {
  const headers = new Headers();

  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("api-key", apiKey);
  }

  return headers;
}
