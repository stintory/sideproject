import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
    example: '1234567890',
    description: '패스워드',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

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
    example: 'male',
    description: '성별',
  })
  @IsString()
  gender: string;

  @ApiProperty({
    required: true,
    example: '홍길동',
    description: '이름',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: '010-1111-2222',
    description: '연락처',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    required: true,
    example: '1990-01-01',
    description: '생년월일',
  })
  @IsNotEmpty()
  @IsString()
  birth: string;
}
