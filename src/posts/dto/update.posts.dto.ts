import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
enum Authority {
  friend = 'friend',
  family = 'family',
  none = 'none',
}
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

  @ApiProperty({
    example: '권한 설정',
    description: 'freinds: {read: false}, family: {read: false}',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permission?: Authority;
}
