import { APP_FILTER } from '@nestjs/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'male ? female',
    description: '성별',
  })
  @IsString()
  @IsOptional()
  sex?: string;

  @ApiProperty({
    example: 'ddd@gmail.com',
    description: '유저 이메일',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'ddd',
    description: '유저 닉네임',
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    example: 'ddd',
    description: '유저 이름',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '010-111-1234',
    description: '유저 연락처',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '2021-01-01',
    description: '애완견 생일',
  })
  @IsString()
  @IsOptional()
  birth?: string;

  @ApiProperty({
    example: 'adfasdfasdfascd',
    description: '연락처 인증 여부',
  })
  @IsString()
  @IsOptional()
  phoneVerified?: boolean;
}
