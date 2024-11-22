import { BadRequestException, Injectable } from '@nestjs/common';
import { PetsRepository } from '../reppository/pets.repository';
import * as fs from 'fs';
import * as path from 'path';
import { ImagesRepository } from '../../images/repository/images.repository';

@Injectable()
export class PetsService {
  constructor(private readonly petsRepository: PetsRepository, private readonly imagesRepository: ImagesRepository) {}

  async create(user, body, file?: Express.Multer.File) {
    const { name, age, gender, birth } = body;
    // file이 존재하면 _upload폴더에 저장
    if (!file) {
      throw new Error('No image file provided');
    }

    const userId = user._id;

    if (!['male', 'female'].includes(gender)) {
      throw new BadRequestException('Invalid gender');
    }

    const data = {
      name,
      image: file.path, // 이미지 경로
      age,
      gender,
      birth,
      userId,
    };
    const result = await this.petsRepository.create(data);
    if (result) {
      const growFalg = false;
      await this.uploadImage(file, growFalg, userId);
    }

    return result;
  }

  async uploadImage(image: Express.Multer.File, growthReport: boolean, userId) {
    const { filename, mimetype } = image;

    const uploadedImage = await this.imagesRepository.uploadImage({
      filename,
      type: mimetype,
      growthReport,
      userId,
    });
    if (!uploadedImage) {
      throw new BadRequestException('이미지 업로드에 실패하였습니다.');
    }

    return uploadedImage._id;
  }

  async findAll(user) {
    try {
      const userId = user._id;
      const result = await this.petsRepository.findAll(userId);
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id) {
    try {
      const result = await this.petsRepository.findById(id);
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePet(id, body) {
    try {
      const { name, age, gender, birth } = body;
      if (!['male', 'female'].includes(gender)) {
        throw new BadRequestException('Invalid gender');
      }
      const updatedAt = new Date();
      const result = await this.petsRepository.findByIdAndUpdate(id, { name, age, gender, birth, updatedAt });
      if (!result) {
        throw new BadRequestException('Update pet failed');
      }
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deletePet(id: string) {
    try {
      const result = await this.petsRepository.findById(id);
      if (!result) {
        throw new BadRequestException('Not exist pet');
      }
      const deletePet = await this.petsRepository.delete(id);
      if (!deletePet) {
        throw new BadRequestException('Delete pet failed');
      }
      return {
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
