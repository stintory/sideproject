import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../schema/transactions.schema';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsRepository {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}
}
