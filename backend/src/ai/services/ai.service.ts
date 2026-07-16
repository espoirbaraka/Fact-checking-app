import { HttpService } from '@nestjs/axios';
import {
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
  ): Promise<AiChatResponse> {
    try {
      const headers = this.buildJsonHeaders();
      const response = await firstValueFrom(
        this.httpService.post<AiChatResponse>(
          `${this.serviceUrl}/chat`,
          {
            message,
            conversation_id: conversationId,
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
  ): Promise<AiChatResponse> {
    try {
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

      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.post<AiChatResponse>(
          `${this.serviceUrl}/chat/upload`,
          form,
          {
            headers,
            timeout: 180_000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          },
        ),
      );

      return response.data;
    } catch (error) {
      const detail =
        error instanceof AxiosError
          ? (error.response?.data ?? error.message)
          : String(error);
      this.logger.error('Failed to upload file to AI service', detail);

      const aiMessage =
        error instanceof AxiosError &&
        typeof error.response?.data === 'object' &&
        error.response.data &&
        'message' in error.response.data
          ? String((error.response.data as { message: string }).message)
          : null;

      throw new ServiceUnavailableException(
        aiMessage ||
          "Impossible d'analyser le fichier. Vérifiez le format (PDF/image) et que l'IA tourne.",
      );
    }
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
