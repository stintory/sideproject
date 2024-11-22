import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRelationRequestDto {
  @ApiProperty({
    example: '6123456789abcdef01234567',
    description: '신청자 ID (유저 A)',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  requesterId: Types.ObjectId; // 유저 A의 ObjectId

  @ApiProperty({
    example: '7123456789abcdef01234567',
    description: '수신자 ID (유저 B)',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  recipientId: Types.ObjectId; // 유저 B의 ObjectId

  @ApiProperty({
    example: 'friend',
    description: '관계 유형 (friend, family, ban)',
    required: true,
    enum: ['friend', 'family', 'ban'],
  })
  @IsEnum(['friend', 'family', 'ban'])
  @IsNotEmpty()
  type: string; // 관계 유형
}
