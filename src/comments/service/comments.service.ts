import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { User } from '../../users/schema/user.schema';
import { PaginationOptions, PaginationResult } from '../../@interface/pagination.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schema/comments.schema';
import { getPaginate } from '../../@utils/pagination.utils';
import { CreateCommentDto } from '../dto/create.comment.dto';
import { async } from 'rxjs';
import { PostsRepository } from '../../posts/repository/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async createComment(user: User, postId, body: CreateCommentDto) {
    try {
      const { comment } = body;
      const userId = user._id;
      const findPost = await this.postsRepository.findById(postId);
      if (!findPost) {
        throw new BadRequestException('Not exist Post');
      }
      const createdComment = await this.commentsRepository.create({ comment, userId, postId });
      if (!createdComment) {
        throw new BadRequestException('Create comment failed');
      }

      const updatedPost = await this.postsRepository.findByIdAndCommentUpdate(postId, { comments: createdComment._id });

      if (!updatedPost) {
        throw new BadRequestException('Update post with comment failed');
      }

      const result = {
        comment: updatedPost.comments,
      };
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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
      const findPost = await this.commentsRepository.findById(id);
      const postId = findPost.postId;
      await this.postsRepository.findByIdAndCommentDelete(postId, id);
      const result = await this.commentsRepository.delete(id);
      if (!result) {
        throw new BadRequestException('Delete comment failed');
      }
      return { message: 'Delete comment successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
