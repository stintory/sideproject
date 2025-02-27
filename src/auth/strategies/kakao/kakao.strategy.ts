import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../../service/auth.service';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../users/repository/users.repository';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    // authService 주입
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const provider = profile.provider;
      const snsId = profile.id;
      // 1. provider && snsId
      const exUser = await this.authService.validateSnsUser(provider, snsId);
      const id = profile.id;
      if (exUser) {
        console.log('already exists');
        return done(null, exUser);
      } else {
        const email = profile._json.kakao_account.email;
        const nickname = profile._json.properties.nickname;
        const provider = 'kakao';
        const snsId = id.toString();
        const newUser = await this.authService.registerSns({ email, nickname, provider, snsId });
        return done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }
}
