import { Module } from '@nestjs/common';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { PostsRepository } from './repository/posts.repository';
import { ImagesRepository } from '../images/repository/images.repository';
import { Post, PostSchema } from './schema/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from '../images/schema/images.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, ImagesRepository],
  exports: [PostsRepository],
})
export class PostsModule {}
