import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    example: 'name',
    description: 'plan name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '{KRW: 0, USD: 0}',
    description: 'price',
  })
  @IsObject()
  price: Record<string, number>;

  @ApiProperty({
    example: 0,
    description: 'tax',
  })
  @IsOptional()
  @IsNumber()
  tax?: number;
}
