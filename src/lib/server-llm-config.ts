import { ChatOptions } from "@/components/chat/chat-options";
import {
  defaultProviderBaseUrls,
  LlmProvider,
  providerLabels,
  normalizeBaseUrl,
  toOpenAIBaseUrl,
} from "@/lib/llm-providers";

export interface LlmConfig {
  provider: LlmProvider;
  providerLabel: string;
  baseUrl: string;
  openAIBaseUrl: string;
  apiKey?: string;
  model?: string;
  tokenLimit: number;
}

let hasLoggedLlmConfig = false;

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

function parseProvider(value?: string): LlmProvider {
  switch (value) {
    case "vllm":
    case "ollama":
    case "openai":
    case "custom":
      return value;
    default:
      return "vllm";
  }
}

export function resolveLlmConfig(chatOptions?: Partial<ChatOptions>): LlmConfig {
  const provider = parseProvider(process.env.LLM_PROVIDER);
  const env = providerEnv[provider];
  const baseUrl =
    process.env[env.url] ||
    (provider === "ollama" ? process.env.VLLM_URL : undefined) ||
    defaultProviderBaseUrls[provider];

  if (!baseUrl) {
    throw new Error(`${env.url} is not set`);
  }

  const apiKey = process.env[env.apiKey];
  const model = process.env[env.model] || chatOptions?.selectedModel;
  const tokenLimit = readNumber(
    process.env[env.tokenLimit] || process.env.VLLM_TOKEN_LIMIT,
    4096
  );

  const config = {
    provider,
    providerLabel: providerLabels[provider],
    baseUrl: normalizeBaseUrl(baseUrl),
    openAIBaseUrl: toOpenAIBaseUrl(baseUrl),
    apiKey,
    model,
    tokenLimit,
  };

  if (!hasLoggedLlmConfig) {
    hasLoggedLlmConfig = true;
    console.log("[llm] resolved provider config", {
      provider: config.provider,
      providerLabel: config.providerLabel,
      baseUrl: config.baseUrl,
      openAIBaseUrl: config.openAIBaseUrl,
      model: config.model ?? null,
      tokenLimit: config.tokenLimit,
      hasApiKey: Boolean(config.apiKey),
    });
  }

  return config;
}

export function getProviderHeaders(apiKey?: string) {
  const headers = new Headers();

  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("api-key", apiKey);
  }

  return headers;
}
