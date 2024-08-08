import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from '../schema/images.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ImagesRepository {
  constructor(@InjectModel(Image.name) private ImageModel: Model<Image>) {}

  async uploadImage(image: Partial<Image>): Promise<Image> {
    const newImage = await this.ImageModel.create(image);
    return newImage.save();
  }

  async create(images: Partial<Image>[]): Promise<Image[]> {
    const result = (await this.ImageModel.insertMany(images)) as Image[];
    return result;
  }
}
