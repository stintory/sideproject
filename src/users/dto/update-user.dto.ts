import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UpdateUserDto {
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
    example: '010-111-1234',
    description: '유저 연락처',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'true or false',
    description: '연락처 인증 여부',
  })
  @IsBoolean()
  @IsOptional()
  phoneVerified?: boolean;
}
