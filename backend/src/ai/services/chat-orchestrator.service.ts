import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationsService } from '../../conversations/services/conversations.service';
import { MessageRole } from '../../messages/entities/message-role.enum';
import { Message } from '../../messages/entities/message.entity';
import { AiChatRequestDto } from '../dto/ai-chat-request.dto';
import {
  ChatReplyResponse,
  FactCheckPayload,
} from '../dto/chat-reply.dto';
import { AiClaim, AiSource } from '../dto/ai-chat-response.dto';
import { AiService } from './ai.service';

@Injectable()
export class ChatOrchestratorService {
  constructor(
    private readonly aiService: AiService,
    private readonly conversationsService: ConversationsService,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async chat(
    userId: string,
    dto: AiChatRequestDto,
  ): Promise<ChatReplyResponse> {
    const conversation = await this.resolveConversation(
      userId,
      dto.conversationId,
      dto.message,
    );

    const userMessage = await this.messagesRepository.save(
      this.messagesRepository.create({
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: dto.message,
      }),
    );

    const aiResponse = await this.aiService.sendMessage(dto.message);

    const assistantMessage = await this.messagesRepository.save(
      this.messagesRepository.create({
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: aiResponse.answer,
      }),
    );

    const claims = aiResponse.claims ?? [];
    const sources = aiResponse.sources ?? [];
    const factCheck = this.buildFactCheck(
      aiResponse.confidence,
      claims,
      sources,
    );

    await this.conversationsService.update(conversation.id, userId, {
      title: this.truncateTitle(dto.message),
    });

    return {
      conversationId: conversation.id,
      userMessage,
      assistantMessage: { ...assistantMessage, factCheck },
      confidence: aiResponse.confidence,
      claims,
      sources,
    };
  }

  private async resolveConversation(
    userId: string,
    conversationId: string | undefined,
    message: string,
  ) {
    if (conversationId) {
      return this.conversationsService.findByIdForUser(conversationId, userId);
    }

    return this.conversationsService.create(userId, {
      title: this.truncateTitle(message),
    });
  }

  private truncateTitle(message: string): string {
    const cleaned = message.trim().replace(/\s+/g, ' ');
    return cleaned.length > 80 ? `${cleaned.slice(0, 77)}...` : cleaned;
  }

  private buildFactCheck(
    confidence: number,
    claims: AiClaim[],
    sources: AiSource[],
  ): FactCheckPayload | undefined {
    if (!claims.length && !sources.length && confidence <= 0) {
      return undefined;
    }

    const primary = claims[0];
    const status = primary
      ? this.mapVerdict(primary.verdict)
      : this.mapConfidence(confidence);

    const claimSources = claims.flatMap((claim) => claim.sources ?? []);
    const allSources = [...sources, ...claimSources];
    const evidenceTexts = claims.flatMap((claim) =>
      (claim.evidence ?? []).map((item) => item.text).filter(Boolean),
    );

    const mappedSources = allSources.slice(0, 8).map((source, index) => ({
      id: `src-${index + 1}`,
      title: source.title ?? `Source ${index + 1}`,
      url: source.url ?? '#',
      snippet: source.snippet ?? '',
      reliability: Math.round(
        Math.min(100, Math.max(0, (source.relevance_score ?? 0.7) * 100)),
      ),
    }));

    const summary = primary
      ? `Verdict: ${primary.verdict} (${Math.round((primary.confidence || confidence) * 100)}% confiance)`
      : `Analyse terminée avec ${Math.round(confidence * 100)}% de confiance.`;

    return {
      status,
      confidence: Math.round(
        (primary?.confidence ?? confidence) * 100,
      ),
      summary,
      evidence:
        evidenceTexts.join('\n\n') ||
        "Analyse basée sur les connaissances du modèle. Vérifiez toujours avec des sources locales fiables (radio communautaire, ONG, autorités).",
      sources: mappedSources,
    };
  }

  private mapVerdict(
    verdict: string,
  ): FactCheckPayload['status'] {
    const normalized = verdict.toLowerCase();
    if (normalized === 'true') return 'verified';
    if (normalized === 'false') return 'false';
    return 'uncertain';
  }

  private mapConfidence(confidence: number): FactCheckPayload['status'] {
    if (confidence >= 0.75) return 'verified';
    if (confidence >= 0.4) return 'uncertain';
    return 'false';
  }
}
