import { Module } from '@nestjs/common';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { PostsRepository } from './repository/posts.repository';
import { ImagesRepository } from '../images/repository/images.repository';
import { Post, PostSchema } from './schema/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from '../images/schema/images.schema';
import { CommentsService } from '../comments/service/comments.service';
import { Comment, CommentSchema } from '../comments/schema/comments.schema';
import { CommentsRepository } from '../comments/repository/comments.repository';
import { UsersRepository } from '../users/repository/users.repository';
import { User, UserSchema } from '../users/schema/user.schema';
import { Like, LikeSchema } from '../likes/schema/likes.schema';
import { LikesRepository } from '../likes/repository/likes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Image.name, schema: ImageSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    ImagesRepository,
    CommentsService,
    CommentsRepository,
    UsersRepository,
    LikesRepository,
  ],
  exports: [PostsRepository],
})
export class PostsModule {}
