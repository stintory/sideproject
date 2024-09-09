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
import { LikesRepository } from '../../likes/repository/likes.repository';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly likesRepository: LikesRepository,
    private readonly usersRepository: UsersRepository,
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
    // const result: any = await Promise.all(data.map(async (comment) => comment));
    const result = await Promise.all(
      data.map(async (comment) => {
        // userId를 이용해 유저 정보 조회
        const user = await this.usersRepository.findByIdCommentId(comment.userId);

        const liked = await this.likesRepository.findOne({ userId, commentId: comment._id });

        return {
          ...comment.toObject(), // 기존 댓글 정보
          liked: !!liked,
          userImage: user?.profileImage ? user.profileImage.src : null, // 유저의 profileImage가 없으면 null
        };
      }),
    );
    return {
      data: result,
      meta: {
        page: paginationOptions.page,
        size: paginationOptions.limit,
        total: totalResults,
      },
    };
  }

  async getComment(user: User, id: string) {
    const userId = new Types.ObjectId(user._id);
    const comment = await this.commentsRepository.findByIdWithComment(id);
    if (!comment) {
      throw new BadRequestException('Not exist Comment');
    }
    const commentId = comment._id;
    const checkLike = await this.likesRepository.findOne({ userId, commentId });

    const findUser = await this.usersRepository.findByIdCommentId(comment.userId);
    return {
      result: {
        ...comment,
        liked: !!checkLike,
        userImage: findUser?.profileImage ? findUser.profileImage.src : null, // 유저의 profileImage가 없으면 null
      },
    };
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

  async toggleLike(userId: string, commentId: string) {
    try {
      const comment = await this.commentsRepository.findById(commentId);
      if (!comment) {
        throw new BadRequestException('Not exist Comment');
      }

      // 좋아요 여부 확인 (LikeSchema에서 조회)
      const existingLike = await this.likesRepository.findOne({ userId, commentId });

      if (existingLike) {
        // 좋아요가 이미 존재 하면 좋아요 취소
        await this.likesRepository.deleteOne({ userId, commentId });
        comment.likes -= 1;
      } else {
        // 좋아요 추가
        await this.likesRepository.create({ userId, commentId });
        comment.likes += 1;
      }

      await comment.save();

      return {
        message: existingLike ? '좋아요 취소됨.' : '좋아요 추가됨.',
        likes: comment.likes,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async totalLike(commentId: string) {
    try {
      const totalLikes = await this.likesRepository.count({ commentId });

      return { likes: totalLikes };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
