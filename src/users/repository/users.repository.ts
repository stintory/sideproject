import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async update(id: string, updateObject: Partial<User>): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateObject, {
        new: true,
      })
      .exec();
  }

  async updateById(id: string | Types.ObjectId, updateObject: UpdateQuery<User>): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async findOne(filter: FilterQuery<User>): Promise<User | null> {
    try {
      return this.userModel.findOne(filter).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
