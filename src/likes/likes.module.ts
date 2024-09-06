import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schema/likes.schema';
import { LikesRepository } from './repository/likes.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }])],
  providers: [LikesRepository],
  exports: [LikesRepository],
})
export class LikesModule {}
