import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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
    description: 'friend, family, none',
    required: false,
  })
  @IsOptional()
  @IsEnum(['friend', 'family', 'none'])
  authority?: string;
}
