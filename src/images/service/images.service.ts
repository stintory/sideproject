import { Injectable } from '@nestjs/common';
import { ImagesRepository } from '../repository/images.repository';
import { User } from '../../users/schema/user.schema';
import { CreateImageDto } from '../dto/create.image.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  async create(user: User, body: CreateImageDto, files: Array<Express.Multer.File>) {
    const { name, growthReport } = body;

    if (!files || files.length === 0) {
      throw new Error('No image file provided');
    }
    const images = files.map((file) => ({
      name,
      filename: file.filename,
      growthReport: growthReport || false,
      src: file.path,
      type: file.mimetype,
      userId: user._id,
    }));

    const result = await this.imagesRepository.create(images);
    return { result };
  }

  // async UploadImage(user: User, post: )
}
