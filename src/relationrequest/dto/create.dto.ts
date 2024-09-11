import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    required: true,
    example: '유저와의 관계',
    description: 'friend, family',
  })
  @IsString()
  type: string;
}
