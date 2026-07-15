import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';
import { AiChatRequestDto } from '../dto/ai-chat-request.dto';
import { ChatOrchestratorService } from '../services/chat-orchestrator.service';
import { AiService } from '../services/ai.service';

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
