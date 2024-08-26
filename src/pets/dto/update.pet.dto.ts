import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdatePetDto {
  @ApiProperty({
    required: false,
    example: 'name',
    description: '이름',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    example: 1,
    description: '나이',
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    required: false,
    example: 'male',
    description: '성별',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    required: false,
    example: '2020-01-01',
    description: '생일',
  })
  @IsOptional()
  @IsString()
  birth?: string;
}
