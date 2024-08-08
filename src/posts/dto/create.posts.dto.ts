import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostsDto {
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
    required: false,
    example: 'comment',
    description: '댓글',
  })
  @IsOptional()
  @IsString()
  comments: string;

  @ApiProperty({
    required: false,
    example: 'growthReport',
    description: '성장기록',
  })
  @IsOptional()
  @IsBoolean()
  growthReport: boolean;
}
