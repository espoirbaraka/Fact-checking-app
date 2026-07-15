import { Message } from '../../messages/entities/message.entity';
import { AiClaim, AiSource } from './ai-chat-response.dto';

export interface FactCheckPayload {
  status: 'verified' | 'uncertain' | 'false';
  confidence: number;
  summary: string;
  evidence: string;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    snippet: string;
    reliability: number;
  }>;
}

export interface ChatReplyResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message & { factCheck?: FactCheckPayload };
  confidence: number;
  claims: AiClaim[];
  sources: AiSource[];
}
