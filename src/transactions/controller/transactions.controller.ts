import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { TransactionsService } from '../service/transactions.service';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { PaginationDecorator } from '../../@decorator/pagination/pagination.decorator';
import { PaginationOptions } from '../../@interface/pagination.interface';

@Controller('transactions')
@ApiTags('Transaction')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransaction(
    @Param('userId', ValidateMongoIdPipe) userId: string,
    @PaginationDecorator() pagination: PaginationOptions,
  ) {
    return await this.transactionsService.getTransaction(userId, pagination);
  }
}
