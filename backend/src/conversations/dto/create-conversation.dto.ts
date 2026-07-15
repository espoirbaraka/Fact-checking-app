import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 'Fact check: Climate change claims' })
  @IsString()
  @IsNotEmpty()
  title!: string;
}
