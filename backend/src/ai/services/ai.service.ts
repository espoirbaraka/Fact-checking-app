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
      const headers = this.buildHeaders();
      const response = await firstValueFrom(
        this.httpService.post<AiChatResponse>(
          `${this.serviceUrl}/chat`,
          {
            message,
            conversation_id: conversationId,
          },
          { headers },
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

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    return headers;
  }
}
