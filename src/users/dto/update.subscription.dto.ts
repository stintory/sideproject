import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriptionDto {
  @ApiProperty({
    required: true,
    example: true,
    description: '정기 결제 구독 여부 (true 일때 다음 정기결제 등록)',
  })
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;
}
