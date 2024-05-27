import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({
    example: 'plan',
    description: 'grade',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '{KRW: 0, USD: 0}',
    description: 'price',
    required: false,
  })
  @IsOptional()
  @IsObject()
  price?: Record<string, number>;

  @ApiProperty({
    example: 0,
    description: 'tax',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tax?: number;
}
