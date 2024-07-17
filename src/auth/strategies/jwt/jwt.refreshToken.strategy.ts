import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../../service/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    if (!req) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const refreshToken = req.headers.authorization.replace('Bearer ', '');

    const userId = payload.sub;

    const user = await this.authService.validateRefreshToken(refreshToken, userId);

    if (!user) {
      throw new UnauthorizedException('Do Not Exist User');
    }

    return user;
  }
}
