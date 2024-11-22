import { Injectable } from '@nestjs/common';
import { Diary } from '../schema/diary.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DiaryRepository {
  constructor(@InjectModel(Diary.name) private readonly diaryModel: Model<Diary>) {}

  async create(data: Partial<Diary>): Promise<Diary> {
    const newDiary = new this.diaryModel(data);
    return newDiary.save();
  }
  async findAll(id: string | Types.ObjectId): Promise<Diary[] | null> {
    const userId = id;
    return await this.diaryModel.find({ userId }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Diary> {
    return this.diaryModel.findById(id).exec();
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, updateObject: UpdateQuery<Diary>): Promise<Diary | null> {
    return await this.diaryModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Diary> {
    return await this.diaryModel.findByIdAndDelete(id).exec();
  }
}
