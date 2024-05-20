import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { KakaoAuthGuard } from '../strategies/kakao/kakao.guard';
import { User } from '../../users/schema/user.schema';
import { CurrentUser } from '../../@decorator/user.decorator';
import { Response } from 'express';
import { GoogleAuthGuard } from '../strategies/google/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async KakaoLogin() {
    return;
  }
  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async KakaoCallback(@CurrentUser() userData: User, @Res() res: Response) {
    console.log('==================');
    console.log(userData);
    const { snsId, email } = userData;
    const result = await this.authService.login(snsId, email);
    return res.redirect('/v1');
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async GoogleLogin() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async GoogleCallback(@CurrentUser() userData: User, @Req() req, @Res() res: Response) {
    const { snsId, email } = userData;
    const result = await this.authService.login(snsId, email);
    console.log(result);
    return res.redirect('/v1');
  }
}
