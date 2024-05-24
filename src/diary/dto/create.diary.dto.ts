import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty({
    required: true,
    example: 'title',
    description: '제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    example: 'content',
    description: '내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    required: true,
    example: 'day',
    description: '날짜',
  })
  @IsString()
  day: string;
}
