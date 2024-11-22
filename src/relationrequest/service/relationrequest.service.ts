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

    const requests = await this.relationsRepository.find({ requesterId, status: 'pending' });
    if (requests.length == 0) {
      return { message: 'none' };
    }

    const recipientIds = requests.map((request) => request.recipientId);
    console.log(recipientIds);

    const recipients = await this.usersRepository.find({ _id: { $in: recipientIds } });

    const recipientNicknames = recipients.reduce((map, user) => {
      map[user._id.toString()] = user.nickname; // Adjust the property name if different
      return map;
    }, {});

    const result = requests.map((request) => ({
      _id: request._id,
      requesterId: request.requesterId,
      recipientId: request.recipientId,
      receivedUser: recipientNicknames[request.recipientId.toString()],
      type: request.type,
      status: request.status,
    }));

    return { result };
  }

  async getReceivedList(user: User) {
    const userId = new Types.ObjectId(user._id);
    const recipientId = userId;

    const requests = await this.relationsRepository.find({ recipientId, status: 'pending' });
    if (requests.length == 0) {
      return { message: 'none' };
    }

    const requesterIds = requests.map((request) => request.requesterId);

    const requesters = await this.usersRepository.find({ _id: { $in: requesterIds } });

    const requesterNicknames = requesters.reduce((map, user) => {
      map[user._id.toString()] = user.nickname;
      return map;
    }, {});

    const result = requests.map((request) => ({
      _id: request._id,
      requesterId: request.requesterId,
      requesterUser: requesterNicknames[request.requesterId.toString()],
      recipientId: request.recipientId,
      type: request.type,
      status: request.status,
    }));

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
