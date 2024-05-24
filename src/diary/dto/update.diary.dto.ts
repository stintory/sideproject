import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDiaryDto {
  @ApiProperty({
    required: false,
    example: 'title',
    description: '제목',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    example: 'content',
    description: '내용',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    required: false,
    example: 'day',
    description: '날짜',
  })
  @IsOptional()
  @IsString()
  day?: string;

  @ApiProperty({
    required: false,
    example: 'lifeEvent',
    description: '이벤트(그래프 이용시 true)',
  })
  @IsOptional()
  @IsString()
  lifeEvent?: string;
}
