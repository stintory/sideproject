import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: '5f978639ddd3ee80dcd8e737',
    description: '결제 플랜 id',
  })
  @IsNotEmpty()
  @IsMongoId()
  planId: string;

  @ApiProperty({
    example: 'Orange1!',
    description: '패스워드',
  })
  @IsNotEmpty()
  @IsString()
  customerUid: string;

  @ApiProperty({
    example: '5f97863addd3ee80dcd8e738',
    description: '인증서버 id',
    deprecated: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['inisis', 'paypal_v2'])
  pgProvider: 'inisis' | 'paypal_v2';

  @ApiProperty({
    example: '이선화',
    description: '이름',
  })
  @IsString()
  buyerName: string;

  @ApiProperty({
    example: 'leo-leb@letsee.io',
    description: '이메일',
  })
  @IsString()
  buyerEmail: string;

  @ApiProperty({
    example: 'Orange1!',
    description: '회사',
  })
  @IsString()
  buyerCompany: string;

  @ApiProperty({
    example: '010-6284-8051',
    description: '휴대폰 번호',
  })
  @IsString()
  buyerTel: string;
}
