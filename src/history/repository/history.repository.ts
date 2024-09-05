import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History } from '../schema/history.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class HistoryRepository {
  constructor(@InjectModel(History.name) private historyModel: Model<History>) {}

  async create(history: Partial<History>): Promise<History> {
    const newHistory = new this.historyModel(history);
    return newHistory.save();
  }

  async findAllWithUserId(query: FilterQuery<History>): Promise<History> {
    return await this.historyModel.findById(query).exec();
  }
}
