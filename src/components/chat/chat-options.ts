import { LlmProvider } from "@/lib/llm-providers";

export interface ChatOptions {
  provider?: LlmProvider;
  selectedModel?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  repeatPenalty?: number;
}
