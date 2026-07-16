import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';
import { AiChatRequestDto } from '../dto/ai-chat-request.dto';
import { ChatOrchestratorService } from '../services/chat-orchestrator.service';
import { AiService } from '../services/ai.service';
import { UploadedFilePayload } from '../types/uploaded-file';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/tiff',
  'image/bmp',
]);

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly chatOrchestrator: ChatOrchestratorService,
  ) {}

  @Post('chat')
  @ApiOperation({
    summary: 'Send a fact-check question and receive an AI answer',
  })
  @ApiResponse({ status: 201, description: 'AI reply generated' })
  async chat(
    @Body() dto: AiChatRequestDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.chatOrchestrator.chat(user.id, dto);
    return {
      data: result,
      message: 'Réponse générée avec succès',
    };
  }

  @Post('chat/upload')
  @ApiOperation({
    summary: 'Fact-check from an uploaded image or PDF (OCR)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        message: { type: 'string' },
        conversationId: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 12 * 1024 * 1024 },
    }),
  )
  async chatUpload(
    @UploadedFile() file: UploadedFilePayload | undefined,
    @Body('message') message: string | undefined,
    @Body('conversationId') conversationId: string | undefined,
    @Body('language') language: string | undefined,
    @CurrentUser() user: User,
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Aucun fichier reçu.');
    }
    if (file.mimetype && !ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(
        'Format non supporté. Utilisez PDF, PNG, JPG, WEBP ou GIF.',
      );
    }

    const result = await this.chatOrchestrator.chatWithFile(
      user.id,
      file,
      message,
      conversationId,
      language,
    );
    return {
      data: result,
      message: 'Fichier analysé avec succès',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI microservice availability' })
  @ApiResponse({ status: 200, description: 'AI service health status' })
  async healthCheck() {
    const health = await this.aiService.healthCheck();
    return {
      data: health,
      message: 'AI service health check completed',
    };
  }
}
