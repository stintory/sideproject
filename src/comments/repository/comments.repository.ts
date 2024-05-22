import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../schema/comments.schema';
import { Model, Types, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async create(comment: Partial<Comment>): Promise<Comment> {
    const newComment = new this.commentModel(comment);
    return newComment.save();
  }

  async findById(id: string | Types.ObjectId): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, updateObject: UpdateQuery<Comment>): Promise<Comment | null> {
    return await this.commentModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Comment> {
    return await this.commentModel.findByIdAndDelete(id).exec();
  }
}
