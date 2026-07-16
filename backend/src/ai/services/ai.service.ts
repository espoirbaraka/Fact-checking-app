import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { AiChatResponse, AiHealthResponse } from '../dto/ai-chat-response.dto';
import { UploadedFilePayload } from '../types/uploaded-file';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly serviceUrl: string;
  private readonly apiKey?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.serviceUrl = this.configService.get<string>('ai.serviceUrl')!;
    this.apiKey = this.configService.get<string>('ai.apiKey') || undefined;
  }

  async sendMessage(
    message: string,
    conversationId?: string,
    language?: string,
  ): Promise<AiChatResponse> {
    try {
      const headers = this.buildJsonHeaders();
      const response = await firstValueFrom(
        this.httpService.post<AiChatResponse>(
          `${this.serviceUrl}/chat`,
          {
            message,
            conversation_id: conversationId,
            language: language || 'fr',
          },
          { headers, timeout: 180_000 },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to reach AI service',
        error instanceof AxiosError
          ? (error.response?.data ?? error.message)
          : String(error),
      );

      throw new ServiceUnavailableException(
        "Le service d'IA est indisponible. Vérifiez qu'Ollama et ai-service tournent.",
      );
    }
  }

  async sendMessageWithFile(
    file: UploadedFilePayload,
    message?: string,
    conversationId?: string,
    language?: string,
  ): Promise<AiChatResponse> {
    // Use native fetch + FormData (axios mishandles Node FormData without form-data.getHeaders)
    const form = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype || 'application/octet-stream',
    });
    form.append('file', blob, file.originalname || 'document');
    if (message?.trim()) {
      form.append('message', message.trim());
    }
    if (conversationId) {
      form.append('conversation_id', conversationId);
    }
    form.append('language', language || 'fr');

    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    let response: Response;
    try {
      response = await fetch(`${this.serviceUrl}/chat/upload`, {
        method: 'POST',
        headers,
        body: form,
        signal: AbortSignal.timeout(180_000),
      });
    } catch (error) {
      this.logger.error(
        'Failed to reach AI service for upload',
        error instanceof Error ? error.message : String(error),
      );
      throw new ServiceUnavailableException(
        "Le service d'IA est indisponible. Vérifiez qu'Ollama et ai-service tournent.",
      );
    }

    const raw = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      data = { message: raw || 'Réponse IA invalide' };
    }

    if (!response.ok) {
      const message =
        typeof data.message === 'string'
          ? data.message
          : `Erreur IA (${response.status})`;
      this.logger.error('AI upload failed', {
        status: response.status,
        message,
      });

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException(message);
      }
      throw new ServiceUnavailableException(message);
    }

    return data as unknown as AiChatResponse;
  }

  async healthCheck(): Promise<AiHealthResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<AiHealthResponse>(`${this.serviceUrl}/health`),
      );

      return response.data;
    } catch (error) {
      this.logger.warn(
        'AI service health check failed',
        error instanceof AxiosError ? error.message : String(error),
      );

      return { status: 'unavailable' };
    }
  }

  async getNordKivuNews(limit = 12): Promise<
    Array<{
      title: string;
      url: string;
      snippet?: string;
      domain?: string;
    }>
  > {
    try {
      const headers = this.buildJsonHeaders();
      const response = await firstValueFrom(
        this.httpService.get<{
          items?: Array<{
            title: string;
            url: string;
            snippet?: string;
            domain?: string;
          }>;
        }>(`${this.serviceUrl}/news/nord-kivu`, {
          headers,
          params: { limit },
          timeout: 45_000,
        }),
      );
      return response.data?.items ?? [];
    } catch (error) {
      this.logger.warn(
        'Nord-Kivu news fetch failed',
        error instanceof AxiosError ? error.message : String(error),
      );
      return [];
    }
  }

  private buildJsonHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    return headers;
  }
}
