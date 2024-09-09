import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schema/likes.schema';
import { LikesRepository } from './repository/likes.repository';
import { LikesController } from './controller/likes.controller';
import { LikesService } from './service/likes.service';
import { UsersRepository } from '../users/repository/users.repository';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [LikesRepository, LikesService, UsersRepository],
  exports: [LikesRepository],
  controllers: [LikesController],
})
export class LikesModule {}
