import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto {
  @ApiPropertyOptional({ example: 'Updated conversation title' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;
}
