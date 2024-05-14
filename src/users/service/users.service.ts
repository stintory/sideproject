import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(userId: string): Promise<User> {
    return this.usersRepository.findById(userId);
  }

  async updateUser(userId: string, updateUser: UpdateUserDto) {
    const update = await this.usersRepository.updateUser(userId, updateUser);
    if (updateUser) {
      return {
        ...updateUser.readOnlyData,
        message: 'Updated successfully',
      };
    } else {
      throw new BadRequestException('Update user failed');
    }
  }
}
