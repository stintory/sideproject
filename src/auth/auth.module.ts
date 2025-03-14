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
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { GoogleStrategy } from './strategies/google/google.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt/jwt.refreshToken.strategy';
import { ImagesRepository } from '../images/repository/images.repository';
import { Image, ImageSchema } from '../images/schema/images.schema';

@Module({
  imports: [
    PassportModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    KakaoStrategy,
    GoogleStrategy,
    UsersRepository,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    ImagesRepository,
  ],
  exports: [AuthRepository, AuthService, KakaoStrategy, GoogleStrategy, JwtRefreshTokenStrategy, JwtStrategy],
})
export class AuthModule {}
