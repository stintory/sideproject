import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../users/repository/users.repository';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '../../users/schema/user.schema';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { RegisterDto } from '../dto/register.user.dto';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { SignUpDto } from '../../users/dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private readonly authRepository: AuthRepository) {}

  async registerSns(body: RegisterDto) {
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

  async register(body: SignUpDto) {
    const { email, password, nickname, gender, name, phone, birth } = body;
    const existingUser = await this.usersRepository.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hasedPassword = await this.makePasswordHash(password);
    // TODO 이메일 인증

    if (!['male', 'female'].includes(gender)) {
      throw new BadRequestException('Invalid gender');
    }

    const newUser = await this.usersRepository.create({
      email,
      password: hasedPassword,
      nickname,
      gender,
      name,
      phone,
      birth,
    });

    // const token = await this.generateToken(newUser);
    // const refreshToken = await this.generateRefreshToken(newUser);
    // const expires_in = await this.getExpToken(token);

    return {
      email: newUser.email,
      nickname: newUser.nickname,
      gender,
      name,
      phone,
      birth,
      message: 'Successfully registered',
    };
  }

  private async makePasswordHash(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new BadRequestException(error.message);
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

  async loginSns(id: string, email: string): Promise<any> {
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
      access_token: token,
      refresh_token: refreshToken,
      expires_in: expires_in,
    };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ email });

    console.log(email);
    console.log(password);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isSamePassword = await this.comparePassword(password, user.toJSON().password);

    if (!isSamePassword) {
      throw new BadRequestException('invalid password');
    }

    const lastLogin = new Date();
    const updateUser = await this.usersRepository.update(user.id, { lastLogin });
    if (!updateUser) {
      throw new BadRequestException('Update user failed');
    }

    const token = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    const expires_in = await this.getExpToken(token);
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      name: user.name,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      gender: user.gender,
      birth: user.birth,
      role: user.role,
      access_token: token,
      refresh_token: refreshToken,
      expires_in: expires_in,
    };
  }

  async logout(id: string) {
    const logout = await this.usersRepository.update(id, {
      refreshToken: null,
      refreshTokenExpires: null,
    });

    if (logout) {
      return { message: 'logout success' };
    }
  }

  private async comparePassword(inputPassword: string, hashPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(inputPassword, hashPassword);
    return isMatch;
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

  async validateRefreshToken(refreshToken: string, userId: any) {
    const isValid = await this.checkIfRefreshTokenIsValid(refreshToken, userId);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findById(userId);
    return user;
  }

  async checkIfRefreshTokenIsValid(refreshToken: string, userId): Promise<boolean> {
    const token = await this.usersRepository.findByIdAndRefreshToken(userId, refreshToken);

    return token && token.refreshTokenExpires > new Date();
  }

  async refreshAccessToken(user: User) {
    const token = await this.generateToken(user);
    const expires_in = await this.getExpToken(token);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      access_token: token,
      expires_in: expires_in,
      refresh_token: refreshToken,
      message: 'successfully created new AccessToken',
    };
  }

  async checkMyPassword(user: User, password: string) {
    const isSamePassword = await this.comparePassword(password, user.toJSON().password);
    console.log(isSamePassword);
    return isSamePassword;
  }
}
