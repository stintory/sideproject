import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../schema/user.schema';
import { CreateDto } from '../../relationrequest/dto/create.dto';
import { ResponseRelationDto } from '../../relationrequest/dto/response.relation.dto';
import { RelationRequestRepository } from '../../relationrequest/repository/relation.request.repository';
import { Types } from 'mongoose';
import { CreateRelationRequestDto } from '../../relationrequest/dto/create.relation.request.dto';
import { ImagesRepository } from '../../images/repository/images.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly relationRequestRepository: RelationRequestRepository,
    private readonly imagesRepository: ImagesRepository,
  ) {}

  async getUser(userId: string): Promise<User> {
    return this.usersRepository.findById(userId);
  }

  async updateUser(userId: string, updateUser: UpdateUserDto, file: Express.Multer.File) {
    let profileImage;

    if (file) {
      profileImage = await this.uploadProfileImage(file, userId);
    }

    const updatedData = {
      ...updateUser,
      ...(profileImage && { profileImage }),
    };

    const result = await this.usersRepository.findByIdAndUpdate(userId, updatedData);
    if (result) {
      const updatedUser = await this.usersRepository.findById(userId);
      if (updatedUser) {
        return {
          ...updatedUser.updateUser,
          message: 'Updated user success.',
        };
      } else {
        throw new BadRequestException('User not found');
      }
    } else {
      throw new BadRequestException('Update user failed');
    }
  }

  private async uploadProfileImage(file: Express.Multer.File, userId) {
    const { filename, mimetype, path } = file;
    const growthReport = false;
    const uploadedProfileImage = await this.imagesRepository.uploadImage({
      filename,
      type: mimetype,
      src: path,
      growthReport,
      userId,
    });
    if (!uploadedProfileImage) {
      throw new BadRequestException('Failed to upload profile image');
    }

    return { _id: uploadedProfileImage._id, src: uploadedProfileImage.src };
  }

  async createRelation(user: User, body: CreateDto) {
    const { email, type } = body;
    // 유저 조회
    const findUser = await this.usersRepository.findOne({ email });
    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    // 유저가 이미 신청보낸 유저와 관계를 가지고 있는지 확인
    const relationExists = findUser.members.some(
      (member) => member.userId.toString() === user._id.toString() && member.role === type,
    );
    if (relationExists) {
      throw new BadRequestException('이미 해당 관계가 존재한다.');
    }

    await this.relationRequestRepository.create({
      requesterId: user._id,
      recipientId: findUser._id,
      type,
      status: 'pending',
    });

    return {
      message: `${findUser.email}에게 ${type} 관계를 신청했습니다.`,
    };
  }

  async relationResponse(user: User, body: ResponseRelationDto) {
    const { requesterId, accept } = body;
    console.log(requesterId);
    const requester = await this.usersRepository.findById(requesterId);
    console.log(requester);
    if (!requester) {
      throw new BadRequestException('신청한 유저를 찾을 수 없다.');
    }

    const requesterObjectId = new Types.ObjectId(requesterId);

    const request = await this.relationRequestRepository.findOne({
      requesterId: requesterObjectId,
      recipientId: user._id,
      status: 'pending',
    });

    if (!request) {
      throw new BadRequestException('해당 관계를 신청할 수 없습니다.');
    }

    if (accept) {
      await this.usersRepository.findByIdAndUpdate(user._id, {
        $push: {
          members: {
            userId: requester._id,
            email: requester.email,
            role: request.type,
          },
        },
      });

      await this.usersRepository.findByIdAndUpdate(requester._id, {
        $push: {
          members: {
            userId: user._id,
            email: user.email,
            role: request.type,
          },
        },
      });

      await this.relationRequestRepository.updateOne({ _id: request._id }, { status: 'accepted' });

      return {
        message: `${requester.email}와 ${request.type} 관계가 수락되었습니다.`,
      };
    } else {
      await this.relationRequestRepository.updateOne({ _id: request._id }, { status: 'rejected' });
      return {
        message: '관계 요청이 거절되었습니다.',
      };
    }
  }

  async deleteRelation(user: User, body: CreateDto) {
    const { email, type } = body;

    const findUser = await this.usersRepository.findOne({ email });
    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const findUserObjectId = new Types.ObjectId(findUser._id);
    // 유저의 members 배열에서 관계 삭제
    await this.usersRepository.findByIdAndUpdate(user._id, {
      $pull: {
        members: {
          userId: findUserObjectId,
          role: type,
        },
      },
    });
    const userObjectId = new Types.ObjectId(user._id);
    await this.usersRepository.findByIdAndUpdate(findUser._id, {
      $pull: {
        members: {
          userId: userObjectId,
          role: type,
        },
      },
    });

    await this.relationRequestRepository.deleteMany({
      $or: [
        {
          requesterId: userObjectId,
          recipientId: findUserObjectId,
          type,
          status: 'accepted',
        },
        {
          requesterId: findUserObjectId,
          recipientId: userObjectId,
          type,
          status: 'accepted',
        },
      ],
    });
    return {
      message: `${findUser.email} 와 ${type}관계를 삭제했습니다.`,
    };
  }

  async deleteUser(userId: string) {
    const deleteUser = await this.usersRepository.delete(userId);
    if (deleteUser) {
      return {
        message: 'Deleted successfully',
      };
    } else {
      throw new BadRequestException('Delete user failed');
    }
  }
}
