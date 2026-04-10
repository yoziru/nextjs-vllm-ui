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
  osirus: {
    url: "OSIRUS_URL",
    apiKey: "OSIRUS_TOKEN",
    model: "",
    tokenLimit: "OSIRUS_TOKEN_LIMIT",
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

function withDefaultProtocol(provider: LlmProvider, value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (provider === "vllm" || provider === "ollama") {
    return `http://${value}`;
  }

  return `https://${value}`;
}

function parseProvider(value?: string): LlmProvider {
  switch (value) {
    case "vllm":
    case "ollama":
    case "openai":
    case "osirus":
    case "custom":
      return value;
    default:
      return "vllm";
  }
}

function resolveBaseUrl(provider: LlmProvider, env: (typeof providerEnv)[LlmProvider]) {
  const baseUrl =
    process.env[env.url] ||
    (provider === "osirus" ? process.env.OSIRUS_BASE_URL : undefined) ||
    (provider === "ollama" ? process.env.VLLM_URL : undefined) ||
    defaultProviderBaseUrls[provider];

  if (!baseUrl) {
    throw new Error(`${env.url} is not set`);
  }

  return normalizeBaseUrl(withDefaultProtocol(provider, baseUrl));
}

function resolveOpenAIBaseUrl(provider: LlmProvider, baseUrl: string) {
  if (provider !== "osirus") {
    return toOpenAIBaseUrl(baseUrl);
  }

  const agentId = (process.env.OSIRUS_AGENT_ID || "").trim();
  if (!agentId) {
    throw new Error("OSIRUS_AGENT_ID is not set");
  }

  const osirusApiBaseUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  return `${osirusApiBaseUrl}/agents/${agentId}/v1`;
}

export function resolveLlmConfig(chatOptions?: Partial<ChatOptions>): LlmConfig {
  const provider = parseProvider(chatOptions?.provider || process.env.LLM_PROVIDER);
  const env = providerEnv[provider];
  const baseUrl = resolveBaseUrl(provider, env);

  const apiKey =
    process.env[env.apiKey] ||
    (provider === "osirus" ? process.env.OSIRUS_API_TOKEN : undefined);
  const model = (env.model ? process.env[env.model] : undefined) || chatOptions?.selectedModel;
  const tokenLimit = readNumber(
    process.env[env.tokenLimit] || process.env.VLLM_TOKEN_LIMIT,
    4096
  );

  const config = {
    provider,
    providerLabel: providerLabels[provider],
    baseUrl,
    openAIBaseUrl: resolveOpenAIBaseUrl(provider, baseUrl),
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
