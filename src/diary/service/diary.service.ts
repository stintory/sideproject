import { BadRequestException, Injectable } from '@nestjs/common';
import { DiaryRepository } from '../repository/diary.repository';
import { v4 } from 'uuid';
import { ImagesRepository } from '../../images/repository/images.repository';
import { Types } from 'mongoose';

@Injectable()
export class DiaryService {
  constructor(private readonly diaryRepository: DiaryRepository, private readonly imagesRepository: ImagesRepository) {}

  async createDiary(user, body, files: Express.Multer.File[]) {
    try {
      const { title, content, day } = body;
      const userId = user._id;
      let imageIds: string[] = [];

      if (files && files.length > 0) {
        imageIds = await Promise.all(files.map((image) => this.uploadImage(image)));
      }

      const newDiaryData: any = {
        title,
        content,
        day,
        userId,
        images: imageIds,
      };
      const result = await this.diaryRepository.create(newDiaryData);
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadImage(image: any) {
    const { originalname, filename, mimetype, path } = image;
    const name = originalname;
    const type = mimetype;
    const src = path;

    const uploadedImage = await this.imagesRepository.uploadImage({ filename, name, type, src });
    if (!uploadedImage) {
      throw new BadRequestException('이미지 업로드에 실패하였습니다.');
    }

    return uploadedImage._id;
  }

  async findAll(user) {
    try {
      const userId = new Types.ObjectId(user._id);
      const result = await this.diaryRepository.findAll(userId);
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiary(id: string) {
    try {
      const result = await this.diaryRepository.findById(id);
      if (!result) {
        throw new BadRequestException('Not exist diary');
      }
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateDiary(id, body) {
    try {
      const { title, content, day } = body;
      const updatedAt = new Date();
      const result = await this.diaryRepository.findByIdAndUpdate(id, { title, content, day, updatedAt });
      return {
        result: {
          ...result,
        },
        message: 'Diary updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDiary(id) {
    try {
      await this.diaryRepository.delete(id);
      return { message: 'Diary deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
