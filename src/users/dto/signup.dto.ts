import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    required: true,
    example: 'addd@example.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'nickname',
    description: 'nickname',
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({
    required: true,
    example: '1234567890',
    description: '패스워드',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
