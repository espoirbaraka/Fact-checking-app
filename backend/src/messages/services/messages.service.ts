import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationsService } from '../../conversations/services/conversations.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageRole } from '../entities/message-role.enum';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly conversationsService: ConversationsService,
  ) {}

  async findByConversation(
    conversationId: string,
    userId: string,
  ): Promise<Message[]> {
    await this.conversationsService.findByIdForUser(conversationId, userId);

    return this.messagesRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    await this.conversationsService.findByIdForUser(
      createMessageDto.conversationId,
      userId,
    );

    const message = this.messagesRepository.create({
      conversationId: createMessageDto.conversationId,
      role: MessageRole.USER,
      content: createMessageDto.content,
    });

    return this.messagesRepository.save(message);
  }

  async remove(id: string, userId: string): Promise<void> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: { conversation: true },
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    await this.conversationsService.findByIdForUser(
      message.conversationId,
      userId,
    );

    await this.messagesRepository.remove(message);
  }
}
