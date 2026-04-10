export const LLM_PROVIDERS = ["vllm", "ollama", "openai", "osirus", "custom"] as const;

export type LlmProvider = (typeof LLM_PROVIDERS)[number];

export const providerLabels: Record<LlmProvider, string> = {
  vllm: "vLLM",
  ollama: "Ollama",
  openai: "OpenAI",
  osirus: "Osirus.AI",
  custom: "OpenAI-compatible",
};

export const defaultProviderBaseUrls: Record<LlmProvider, string> = {
  vllm: "http://localhost:8000",
  ollama: "http://localhost:11434",
  openai: "https://api.openai.com",
  osirus: "",
  custom: "",
};

export function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function toOpenAIBaseUrl(baseUrl: string) {
  const normalized = normalizeBaseUrl(baseUrl);
  return normalized.endsWith("/v1") ? normalized : `${normalized}/v1`;
}
