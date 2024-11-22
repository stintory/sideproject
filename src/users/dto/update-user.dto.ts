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
    example: 'male or female',
    description: '유저 성별',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    example: '홍길동',
    description: '유저 이름',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    example: 'images',
    description: '프로필 이미지 URL',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: '유저 생년월일',
  })
  @IsString()
  @IsOptional()
  birth?: string;

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
