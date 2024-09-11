import { BadRequestException, Injectable } from '@nestjs/common';
import { RelationRequestRepository } from '../repository/relation.request.repository';
import { User } from '../../users/schema/user.schema';
import { Types } from 'mongoose';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class RelationrequestService {
  constructor(
    private readonly relationsRepository: RelationRequestRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getRequestList(user: User) {
    const userId = new Types.ObjectId(user._id);
    const requesterId = userId;

    const result = await this.relationsRepository.find({ requesterId });
    if (result.length == 0) {
      return { message: 'none' };
    }
    return { result };
  }

  async getReceivedList(user: User) {
    const userId = new Types.ObjectId(user._id);
    const recipientId = userId;

    const result = await this.relationsRepository.find({ recipientId });
    if (result.length == 0) {
      return { message: 'none' };
    }
    return { result };
  }

  async getAcceptedList(user: User, status: string) {
    const userId = new Types.ObjectId(user._id);
    console.log(userId);
    try {
      const relations = await this.relationsRepository.find({
        $or: [
          { recipientId: userId, status },
          { requesterId: userId, status },
        ],
      });

      const userIds = relations.map((relation) =>
        relation.requesterId.toString() === userId.toString() ? relation.recipientId : relation.requesterId,
      );
      console.log(userIds);

      const users = await this.usersRepository.find({ _id: { $in: userIds } });

      if (users.length === 0) {
        return { message: 'none' };
      }

      const userInfo = users.map((user) => ({
        _id: user._id,
        email: user.email,
        nickname: user.nickname,
        image: user.profileImage,
      }));
      return {
        data: userInfo,
        message: `relationships successfully.`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
