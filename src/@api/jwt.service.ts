import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  async verifyToken(token: string | string[], secretKey: string): Promise<any> {
    let decoded = null;
    try {
      if (typeof token === 'string') {
        decoded = await jwt.verify(token, secretKey, { algorithms: ['HS256'] });
      } else {
        throw new UnauthorizedException('잘못된 토큰 형식입니다.');
      }
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  async requestToken(payload: string | object | Buffer, secretKey: string, options: any): Promise<string> {
    let token = null;
    try {
      token = await jwt.sign(payload, secretKey, options);
    } catch (error) {
      return error;
    }
    return token;
  }
}
