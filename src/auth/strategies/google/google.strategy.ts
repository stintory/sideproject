import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'jsonwebtoken';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    try {
      const { displayName, emails, provider, id } = profile;
      const email = emails[0].value;
      const nickname = displayName;
      const snsId = id;
      const exUser = await this.authService.validateSnsUser(provider, id);
      if (exUser) {
        console.log('already exists');
        return done(null, exUser);
      } else {
        const newUser = await this.authService.register({ email, nickname, provider, snsId });
        return done(null, newUser);
      }
    } catch (error) {
      return done(null, error);
    }
  }
}
