import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { ConversationsService } from '../services/conversations.service';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'List conversations for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async findAll(@CurrentUser() user: User) {
    const conversations = await this.conversationsService.findAllByUser(
      user.id,
    );
    return {
      data: conversations,
      message: 'Conversations retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by id' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const conversation = await this.conversationsService.findByIdForUser(
      id,
      user.id,
    );
    return {
      data: conversation,
      message: 'Conversation retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  async create(
    @Body() createConversationDto: CreateConversationDto,
    @CurrentUser() user: User,
  ) {
    const conversation = await this.conversationsService.create(
      user.id,
      createConversationDto,
    );
    return {
      data: conversation,
      message: 'Conversation created successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Conversation updated successfully',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @CurrentUser() user: User,
  ) {
    const conversation = await this.conversationsService.update(
      id,
      user.id,
      updateConversationDto,
    );
    return {
      data: conversation,
      message: 'Conversation updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.conversationsService.remove(id, user.id);
    return {
      data: null,
      message: 'Conversation deleted successfully',
    };
  }
}
