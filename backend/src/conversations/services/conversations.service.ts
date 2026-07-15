import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
  ) {}

  async findAllByUser(userId: string): Promise<Conversation[]> {
    return this.conversationsRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findByIdForUser(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${id} not found`);
    }

    if (conversation.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    return conversation;
  }

  async create(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const conversation = this.conversationsRepository.create({
      ...createConversationDto,
      userId,
    });

    return this.conversationsRepository.save(conversation);
  }

  async update(
    id: string,
    userId: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    const conversation = await this.findByIdForUser(id, userId);
    Object.assign(conversation, updateConversationDto);
    return this.conversationsRepository.save(conversation);
  }

  async remove(id: string, userId: string): Promise<void> {
    const conversation = await this.findByIdForUser(id, userId);
    await this.conversationsRepository.remove(conversation);
  }
}
