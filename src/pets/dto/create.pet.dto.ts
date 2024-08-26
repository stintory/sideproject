import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({
    required: true,
    example: 'name',
    description: '이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: 1,
    description: '나이',
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    required: true,
    example: 'male',
    description: '성별',
  })
  @IsString()
  gender: string;

  @ApiProperty({
    required: true,
    example: '2020-01-01',
    description: '생일',
  })
  @IsString()
  birth: string;
}
