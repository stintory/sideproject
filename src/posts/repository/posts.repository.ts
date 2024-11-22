import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
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

  async findByIdComments(id: string | Types.ObjectId): Promise<Post> {
    return this.postModel.findById(id).populate({ path: 'comments', select: '_id userId comment createdAt' }).exec();
  }

  async findByIdWithImage(query: FilterQuery<Post>): Promise<Post> {
    return this.postModel.findById(query).populate('images', 'src');
  }

  async findByIdWithBookmark(userId: string | Types.ObjectId, isBookmark: boolean): Promise<Post[]> {
    return this.postModel.find({ userId, isBookmark }).exec();
  }

  async find(id: string): Promise<Post> {
    return this.postModel.findById(id).populate('comments').populate('images').exec();
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, updateObject: UpdateQuery<Post>): Promise<Post | null> {
    return await this.postModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async deleteById(id: string | Types.ObjectId): Promise<Post> {
    return await this.postModel.findByIdAndDelete(id).exec();
  }

  async findByIdAndCommentUpdate(id: string | Types.ObjectId, updateData: any): Promise<Post> {
    return (
      this.postModel
        .findByIdAndUpdate(id, { $push: updateData }, { new: true })
        // .populate('comments')
        .exec()
    );
  }

  async findByIdAndCommentDelete(id: string | Types.ObjectId, commentId: string): Promise<Post> {
    const result = await this.postModel.findByIdAndUpdate(id, { $pull: { comments: commentId } }, { new: true }).exec();

    return result;
  }
}
