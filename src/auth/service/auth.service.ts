import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/repository/users.repository';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '../../users/schema/user.schema';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { RegisterDto } from '../dto/register.user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private readonly authRepository: AuthRepository) {}

  async register(body: RegisterDto) {
    const { email, nickname, provider, snsId } = body;
    const findUser = await this.usersRepository.findOne({ email });
    if (!findUser) {
      const newUser = await this.usersRepository.create({
        email,
        nickname,
        provider,
        snsId,
      });
      return newUser;
    }
    if (findUser.snsId !== snsId) {
      const updateUser = await this.usersRepository.update(email, { snsId });
      if (updateUser) {
        return updateUser;
      } else {
        throw new BadRequestException('Update user failed');
      }
    }
  }

  async validateUser(payload: any): Promise<User | null> {
    const { sub } = payload;
    const user = await this.usersRepository.findById(sub);
    return user;
  }

  async validateSnsUser(provider: string, snsId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ provider, snsId });
    return user;
  }

  async login(id: string, email: string): Promise<any> {
    const user = await this.usersRepository.findOne({ snsId: id, email });
    if (!user) {
      throw new BadRequestException('user not found');
    }

    const token = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    const expires_in = await this.getExpToken(token);

    // todo plan Id 같이 생성 해야함.
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      // planId: user.planId,
      role: user.role,
      authority: user.authority,
      access_token: token,
      refresh_token: refreshToken,
      expires_in: expires_in,
    };
  }

  async generateToken(user: User): Promise<string> {
    const { JWT_ACCESS_TOKEN_EXP, JWT_ACCESS_TOKEN_SECRET } = process.env;

    const payload = {
      sub: user._id,
      role: user.role,
    };

    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXP,
    });
  }

  async generateRefreshToken(user: User): Promise<string> {
    const { JWT_REFRESH_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXP } = process.env;
    const payload = {
      sub: user._id,
    };

    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: JWT_REFRESH_TOKEN_EXP,
    });

    // refresh token 만료시간
    const refreshTokenExpires = await this.getExpRefreshToken(refreshToken);
    await this.usersRepository.update(user._id, { refreshToken, refreshTokenExpires });

    return refreshToken;
  }

  private async getExpRefreshToken(token: string) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET) as JwtPayload;
      const expirationTime = decodedToken.exp;
      const expiresTime = new Date(expirationTime * 1000);
      return expiresTime;
    } catch (error) {
      console.error('Token verification failed:', error.message);
    }
  }
  private async getExpToken(token: string) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
      const expirationTime = decodedToken.exp;
      const iatTime = decodedToken.iat;

      const expiresTime = expirationTime - iatTime;
      const currentDate = new Date();
      const milliSecond = expiresTime * 1000;
      console.log('Expiration Time:', new Date(currentDate.getTime() + milliSecond)); // UNIX 타임스탬프를 일반 날짜로 변환
      return expiresTime;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
