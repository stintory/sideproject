import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History } from '../schema/history.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class HistoryRepository {
  constructor(@InjectModel(History.name) private historyModel: Model<History>) {}

  async create(history: Partial<History>): Promise<History> {
    const newHistory = new this.historyModel(history);
    return newHistory.save();
  }

  async findAllWithUserId(id: string | Types.ObjectId): Promise<History[] | null> {
    const userId = id;
    return await this.historyModel.find({ userId }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<History> {
    return await this.historyModel.findById(id).exec();
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, updateObject: UpdateQuery<History>): Promise<History | null> {
    return await this.historyModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async findByIdAndDelete(id: string | Types.ObjectId): Promise<History | null> {
    return await this.historyModel.findByIdAndDelete(id).exec();
  }
}
