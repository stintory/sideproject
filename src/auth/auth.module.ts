import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { User, UserSchema } from '../users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { KakaoStrategy } from './strategies/kakao/kakao.strategy';
import { UsersRepository } from '../users/repository/users.repository';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, KakaoStrategy, UsersRepository],
  exports: [AuthRepository, AuthService, KakaoStrategy],
})
export class AuthModule {}
