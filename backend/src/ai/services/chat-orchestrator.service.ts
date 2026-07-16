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
import { UploadedFilePayload } from '../types/uploaded-file';

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

    const aiResponse = await this.aiService.sendMessage(
      dto.message,
      undefined,
      dto.language,
    );

    return this.persistAssistantReply(
      userId,
      conversation.id,
      userMessage,
      aiResponse,
      dto.message,
    );
  }

  async chatWithFile(
    userId: string,
    file: UploadedFilePayload,
    message?: string,
    conversationId?: string,
    language?: string,
  ): Promise<ChatReplyResponse> {
    const displayMessage =
      message?.trim() ||
      `📎 ${file.originalname || 'document'}`;

    const conversation = await this.resolveConversation(
      userId,
      conversationId,
      displayMessage,
    );

    const userMessage = await this.messagesRepository.save(
      this.messagesRepository.create({
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: displayMessage,
      }),
    );

    const aiResponse = await this.aiService.sendMessageWithFile(
      file,
      message,
      conversation.id,
      language,
    );

    return this.persistAssistantReply(
      userId,
      conversation.id,
      userMessage,
      aiResponse,
      displayMessage,
    );
  }

  private async persistAssistantReply(
    userId: string,
    conversationId: string,
    userMessage: Message,
    aiResponse: Awaited<ReturnType<AiService['sendMessage']>>,
    titleSource: string,
  ): Promise<ChatReplyResponse> {
    const assistantMessage = await this.messagesRepository.save(
      this.messagesRepository.create({
        conversationId,
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

    await this.conversationsService.update(conversationId, userId, {
      title: this.truncateTitle(titleSource),
    });

    return {
      conversationId,
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
    const hasSources = sources.length > 0;
    // Oui/Non follows the analysis verdict; zero sources alone forces Non
    const status: FactCheckPayload['status'] = primary
      ? this.mapVerdict(primary.verdict)
      : 'false';

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

    const percent = Math.round((primary?.confidence ?? confidence) * 100);
    const label = status === 'verified' ? 'Oui' : status === 'false' ? 'Non' : 'Incertain';
    const summary = hasSources
      ? `${label} ${percent}% (${mappedSources.length} source(s) consultée(s)).`
      : `${label} ${percent}% (aucune source crédible trouvée).`;

    return {
      status,
      confidence: percent,
      summary,
      evidence:
        evidenceTexts.join('\n\n') ||
        (hasSources
          ? 'Analyse basée sur les sources listées ci-dessous.'
          : 'Aucune source crédible n’a été trouvée. L’affirmation est considérée comme fausse / non confirmée.'),
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
}
