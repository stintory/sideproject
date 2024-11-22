import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../service/auth.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer를 통해 JWT 추출
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET, // JWT 서명 확인 시 사용되는 비밀키
      usernameField: '',
    });
  }

  // passport에 의해 자동으로 실행되는 Callback 함수.
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload); // 유저 검증 로직
    if (!user) {
      throw new UnauthorizedException('접근 오류');
    }
    return user;
  }
}
