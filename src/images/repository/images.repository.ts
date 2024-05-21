import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from '../schema/images.schema';
import { Model } from 'mongoose';

@Injectable()
export class ImagesRepository {
  constructor(@InjectModel(Image.name) private ImageModel: Model<Image>) {}

  async uploadImage(image: Partial<Image>): Promise<Image> {
    const newImage = await this.ImageModel.create(image);
    return newImage.save();
  }
}
