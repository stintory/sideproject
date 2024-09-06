import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';
import { CommentsRepository } from './repository/comments.repository';
import { Comment, CommentSchema } from './schema/comments.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsRepository } from '../posts/repository/posts.repository';
import { Post, PostSchema } from '../posts/schema/posts.schema';
import { Like, LikeSchema } from '../likes/schema/likes.schema';
import { LikesRepository } from '../likes/repository/likes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, PostsRepository, LikesRepository],
  exports: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
