import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostsDto {
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
}
