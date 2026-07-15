export interface AiSource {
  title?: string;
  url?: string;
  snippet?: string;
  relevance_score?: number;
}

export interface AiEvidence {
  text: string;
  source?: AiSource;
  relevance_score?: number;
}

export interface AiClaim {
  claim: string;
  verdict: string;
  confidence: number;
  evidence: AiEvidence[];
  sources: AiSource[];
}

export interface AiChatResponse {
  answer: string;
  confidence: number;
  sources?: AiSource[];
  claims?: AiClaim[];
}

export interface AiHealthResponse {
  status: string;
}
