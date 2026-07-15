import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessagesService } from '../services/messages.service';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'List messages in a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async findByConversation(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @CurrentUser() user: User,
  ) {
    const messages = await this.messagesService.findByConversation(
      conversationId,
      user.id,
    );
    return {
      data: messages,
      message: 'Messages retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: User,
  ) {
    const message = await this.messagesService.create(
      user.id,
      createMessageDto,
    );
    return {
      data: message,
      message: 'Message created successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.messagesService.remove(id, user.id);
    return {
      data: null,
      message: 'Message deleted successfully',
    };
  }
}
