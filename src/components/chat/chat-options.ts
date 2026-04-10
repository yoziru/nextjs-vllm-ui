export interface ChatOptions {
  selectedModel?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  repeatPenalty?: number;
}
