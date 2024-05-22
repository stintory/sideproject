import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { User } from '../../users/schema/user.schema';
import { PaginationOptions, PaginationResult } from '../../@interface/pagination.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schema/comments.schema';
import { getPaginate } from '../../@utils/pagination.utils';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async findAll(user: User, paginationOptions: PaginationOptions): Promise<PaginationResult<Comment>> {
    const userId = new Types.ObjectId(user._id);
    const condition = { userId };
    const { data, totalResults } = await getPaginate<Comment>(this.commentModel, condition, paginationOptions, {});
    const result: any = await Promise.all(data.map(async (comment) => comment));

    return {
      data: result,
      meta: {
        page: paginationOptions.page,
        size: paginationOptions.limit,
        total: totalResults,
      },
    };
  }

  async getComment(id: string) {
    const result = await this.commentsRepository.findById(id);
    return { result };
  }

  async updateComment(id: string, body) {
    try {
      const { comment } = body;
      const updatedAt = new Date();
      const result = await this.commentsRepository.findByIdAndUpdate(id, { comment, updatedAt });
      if (!result) {
        throw new BadRequestException('Update comment failed');
      }
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteComment(id: string) {
    try {
      const result = await this.commentsRepository.delete(id);
      if (!result) {
        throw new BadRequestException('Delete comment failed');
      }
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
