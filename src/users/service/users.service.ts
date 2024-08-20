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
    const result = await this.usersRepository.update(userId, updateUser);
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
