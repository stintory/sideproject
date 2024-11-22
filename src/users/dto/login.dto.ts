import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'addd@example.com',
    description: '로그인할 이메일',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: '로그인할 비밀번호',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
