import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../repository/trnsactions.repository';
import { PaginationOptions, PaginationResult } from '../../@interface/pagination.interface';
import { Transaction } from '../schema/transactions.schema';
import { Model, Types } from 'mongoose';
import { getPaginate } from '../../@utils/pagination.utils';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

  async getTransaction(id: string, paginationOptions: PaginationOptions): Promise<PaginationResult<Transaction>> {
    try {
      const userId = new Types.ObjectId(id);
      const condition = { userId };

      const { data, totalResults } = await getPaginate<Transaction>(
        this.transactionModel,
        condition,
        paginationOptions,
        {},
      );

      return {
        data: data,
        meta: {
          page: paginationOptions.page,
          size: paginationOptions.limit,
          total: totalResults,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
