import { BadRequestException, Injectable } from '@nestjs/common';
import { HistoryRepository } from '../repository/history.repository';
import { User } from '../../users/schema/user.schema';
import { Types } from 'mongoose';

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
      const history = await this.historyRepository.findAllWithUserId(user._id);
      if (!history) {
        throw new Error('get all history error');
      }

      return history;
    } catch (error) {
      throw new BadRequestException('Get all history error');
    }
  }

  async getHistory(id: string) {
    try {
      const result = await this.historyRepository.findById(id);
      if (!result) {
        throw new BadRequestException('Not exist History');
      }
      return result;
    } catch (error) {
      throw new BadRequestException('Get history error');
    }
  }

  async updateHistory(id: string, title: string, content: string) {
    try {
      const result = await this.historyRepository.findByIdAndUpdate(id, { title, content });
      if (!result) {
        throw new BadRequestException('Update history failed');
      }
      return result;
    } catch (error) {
      throw new BadRequestException('Update history failed');
    }
  }

  async deleteHistory(id: string) {
    try {
      const result = await this.historyRepository.findByIdAndDelete(id);
      if (!result) {
        throw new BadRequestException('Not exist history');
      }
      return { message: 'History deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Delete history failed');
    }
  }
}
