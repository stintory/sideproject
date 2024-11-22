import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    required: true,
    example: 'image1',
    description: '이미지 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: true,
    description: '성장 보고서',
  })
  @IsOptional()
  @IsBoolean()
  growthReport?: boolean;
}
