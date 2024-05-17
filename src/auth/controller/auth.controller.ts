import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { KakaoAuthGuard } from '../strategies/kakao/kakao.guard';
import { User } from '../../users/schema/user.schema';
import { CurrentUser } from '../../@decorator/user.decorator';
import { Response } from 'express';

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
    await this.authService.login(userData);
    return res.redirect('/v1');
  }
}
