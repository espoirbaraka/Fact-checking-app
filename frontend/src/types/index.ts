export type VerificationStatus = "verified" | "uncertain" | "false";

export type MessageRole = "user" | "assistant" | "system";

export type AIModel = "gpt-3.5" | "gpt-4" | "qwen";

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  reliability: number;
}

export interface FactCheckResult {
  status: VerificationStatus;
  confidence: number;
  sources: Source[];
  evidence: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  isStreaming?: boolean;
  factCheck?: FactCheckResult;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: AIModel;
  plugin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string;
}
