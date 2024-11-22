import { BadRequestException, Injectable } from '@nestjs/common';
import { LikesRepository } from '../repository/likes.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { User } from '../../users/schema/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository, private readonly usersRepository: UsersRepository) {}

  async checkLike(user: User, postId?: string, commentId?: string) {
    const userId = new Types.ObjectId(user._id);
    try {
      if (postId) {
        const like = await this.likesRepository.findOne({ userId, postId });
        return { result: like, liked: !!like };
      } else if (commentId) {
        const like = await this.likesRepository.findOne({ userId, commentId });
        return { result: like, liked: !!like };
      } else {
        throw new BadRequestException('Invalid request');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
