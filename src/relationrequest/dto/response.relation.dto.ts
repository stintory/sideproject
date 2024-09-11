import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ResponseRelationDto {
  @ApiProperty({
    required: true,
    example: true,
    description: '관계 성공 여부',
  })
  @IsBoolean()
  accept: boolean;

  @ApiProperty({
    required: true,
    example: 'requesterId',
    description: '요청한 user ObjectId',
  })
  @IsString()
  requesterId: string;
}
