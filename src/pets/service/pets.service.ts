import { BadRequestException, Injectable } from '@nestjs/common';
import { PetsRepository } from '../reppository/pets.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PetsService {
  constructor(private readonly petsRepository: PetsRepository) {}

  async create(user, body, file?) {
    const { name, age, sex, birth } = body;
    const uploadPath = path.join(__dirname, '../../../../uploads', file.filename);
    fs.writeFileSync(uploadPath, file.buffer);

    const userId = user._id;

    const data = {
      name,
      age,
      sex,
      birth,
      userId,
    };
    const result = await this.petsRepository.create(data);

    return { result };
  }

  async findAll(user) {
    try {
      const userId = user.id;
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
      const { name, age, sex, birth } = body;
      const updatedAt = new Date();
      const result = await this.petsRepository.findByIdAndUpdate(id, { name, age, sex, birth, updatedAt });
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
