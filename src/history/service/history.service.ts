import { BadRequestException, Injectable } from '@nestjs/common';
import { HistoryRepository } from '../repository/history.repository';
import { User } from '../../users/schema/user.schema';

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async createHistory(user: User, title: string, content: string) {
    try {
      const userId = user._id;
      const newHistoryData = {
        userId,
        title,
        content,
      };

      const newHistory = await this.historyRepository.create(newHistoryData);
      if (!newHistory) {
        throw new Error('create history error');
      }

      return newHistory;
    } catch (error) {
      throw new BadRequestException('Create history error');
    }
  }

  async getAllHistory(user: User) {
    try {
      const userId = user._id;
      const history = await this.historyRepository.findAllWithUserId({ userId: userId });
      if (!history) {
        throw new Error('get all history error');
      }

      return history;
    } catch (error) {
      throw new BadRequestException('Get all history error');
    }
  }
}
