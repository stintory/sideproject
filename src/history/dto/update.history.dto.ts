import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateHistoryDto {
  @ApiProperty({
    required: true,
    example: 'title',
    description: '제목',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    required: true,
    example: 'content',
    description: '내용',
  })
  @IsString()
  @IsOptional()
  content: string;
}
