import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateObject: Partial<User>): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateObject, {
        new: true,
      })
      .exec();
  }
}
