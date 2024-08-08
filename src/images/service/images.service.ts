import { Injectable, UploadedFiles } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ImagesRepository } from '../repository/images.repository';
import { User } from '../../users/schema/user.schema';
import { CurrentUser } from '../../@decorator/user.decorator';
import { CreateImageDto } from '../dto/create.image.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  async create(user: User, body: CreateImageDto, files: Array<Express.Multer.File>) {
    const { name, growthReport } = body;
    let processdFiles;

    if (!files || files.length === 0) {
      throw new Error('No image file provided');
    } else {
      processdFiles = files.map((file) => {
        file.filename = `${Date.now()}_${file.originalname}`;
        return file;
      });
    }

    const images = processdFiles.map((file) => ({
      name,
      filename: file.originalname,
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
