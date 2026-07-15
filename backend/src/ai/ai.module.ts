import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from '../conversations/conversations.module';
import { Message } from '../messages/entities/message.entity';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { ChatOrchestratorService } from './services/chat-orchestrator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ConversationsModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('ai.serviceUrl'),
        timeout: 180_000,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [AiController],
  providers: [AiService, ChatOrchestratorService],
  exports: [AiService, ChatOrchestratorService],
})
export class AiModule {}
