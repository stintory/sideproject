import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    required: true,
    example: 'email',
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'nickname',
    description: '닉네임',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    required: true,
    example: 'kakao',
    description: '소셜 로그인',
  })
  @IsString()
  provider: string;

  @ApiProperty({
    required: true,
    example: 'id',
    description: '소셜 아이디',
  })
  @IsString()
  snsId: string;
}
