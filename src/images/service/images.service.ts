import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ImagesRepository } from '../repository/images.repository';

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  async create(user, body, files) {
    const { name, growthReport, src, type } = body;

    if (!files) {
      throw new Error('No image file provided');
    }
  }
}
