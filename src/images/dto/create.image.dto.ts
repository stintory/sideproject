import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    required: true,
    example: 'image1',
    description: '이미지 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    default: false,
    example: 'growthReport',
    description: '성장 보고서(true)',
  })
  @IsBoolean()
  growthReport: boolean;

  @ApiProperty({
    required: false,
    example: 'https://example.com/image1.jpg',
    description: '이미지 URL',
  })
  src: string;

  @ApiProperty({
    required: false,
    example: 'image/jpeg',
    description: '이미지 MIME Type',
  })
  type: string;
}
