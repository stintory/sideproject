import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    required: false,
    example: 'comment',
    description: '댓글',
  })
  @IsString()
  comment: string;
}
