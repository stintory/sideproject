import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../schema/likes.schema';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private likeModel: Model<Like>) {}

  async create(query: FilterQuery<Like>): Promise<Like> {
    return await this.likeModel.create(query);
  }
  async findOne(query: FilterQuery<Like>): Promise<Like> {
    return await this.likeModel.findOne(query).exec();
  }

  async findOneLike(query: FilterQuery<Like>): Promise<Like> {
    return await this.likeModel.findOne(query).exec();
  }

  async deleteOne(query: FilterQuery<Like>): Promise<{ deletedCount?: number }> {
    return await this.likeModel.deleteOne(query).exec();
  }

  async count(query: FilterQuery<Like>): Promise<number> {
    return await this.likeModel.countDocuments(query).exec();
  }

  async find(query: FilterQuery<Like>): Promise<Like[]> {
    return await this.likeModel.find(query).exec();
  }
}
