import { Injectable } from '@nestjs/common';
import { Model, Types, UpdateQuery } from 'mongoose';
import { Post } from '../schema/posts.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(post: Partial<Post>): Promise<Post> {
    const newPost = new this.postModel(post);
    return newPost.save();
  }

  async findById(id: string | Types.ObjectId): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  async updateById(id: string | Types.ObjectId, updateObject: UpdateQuery<Post>): Promise<Post | null> {
    return await this.postModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async deleteById(id: string | Types.ObjectId): Promise<Post> {
    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
