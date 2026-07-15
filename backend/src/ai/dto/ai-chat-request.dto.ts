import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AiChatRequestDto {
  @ApiProperty({
    example:
      'Est-il vrai que tous les camps de déplacés de Goma ont été fermés ?',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Existing conversation id (optional)',
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
