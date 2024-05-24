import { Module } from '@nestjs/common';
import { DiaryController } from './controller/diary.controller';
import { DiaryService } from './service/diary.service';
import { DiaryRepository } from './repository/diary.repository';
import { Diary, DiarySchema } from './schema/diary.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesRepository } from '../images/repository/images.repository';
import { Image, ImageSchema } from '../images/schema/images.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diary.name, schema: DiarySchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService, DiaryRepository, ImagesRepository],
})
export class DiaryModule {}
