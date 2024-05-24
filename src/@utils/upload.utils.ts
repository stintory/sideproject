import { BadRequestException } from '@nestjs/common';
import { ImagesRepository } from '../images/repository/images.repository';

export async function uploadImage(image: any, imagesRepository: any): Promise<any> {
  const { originalname, mimetype } = image;
  const name = originalname;
  const type = mimetype;

  const uploadedImage = await imagesRepository.uploadImage({ name, type });
  if (!uploadedImage) {
    throw new BadRequestException('이미지 업로드에 실패하였습니다.');
  }

  return uploadedImage._id;
}
