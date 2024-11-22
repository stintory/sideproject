import { Module } from '@nestjs/common';
import { ImagesController } from './controller/images.controller';
import { ImagesService } from './service/images.service';
import { ImagesRepository } from './repository/images.repository';
import { Image, ImageSchema } from './schema/images.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesRepository, ImagesService],
})
export class ImagesModule {}
