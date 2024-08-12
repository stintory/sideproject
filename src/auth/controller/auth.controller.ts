import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { KakaoAuthGuard } from '../strategies/kakao/kakao.guard';
import { User } from '../../users/schema/user.schema';
import { CurrentUser } from '../../@decorator/user.decorator';
import { Response } from 'express';
import { GoogleAuthGuard } from '../strategies/google/google.guard';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from '../../users/dto/signup.dto';
import { LoginDto } from '../../users/dto/login.dto';
import { JwtAuthGuard } from '../strategies/jwt/jwt.guard';
import { JwtRefreshTokenGuard } from '../strategies/jwt/jwt.refresh.token.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @ApiExcludeEndpoint()
  @UseGuards(KakaoAuthGuard)
  async KakaoLogin() {
    return;
  }
  @Get('kakao/callback')
  @ApiExcludeEndpoint()
  @UseGuards(KakaoAuthGuard)
  async KakaoCallback(@CurrentUser() userData: User, @Res() res: Response) {
    console.log('==================');
    console.log(userData);
    const { snsId, email } = userData;
    const result = await this.authService.login(snsId, email);
    console.log(result);
    return res.redirect('/v1');
  }

  @Get('google')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  async GoogleLogin() {
    return;
  }

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  async GoogleCallback(@CurrentUser() userData: User, @Req() req, @Res() res: Response) {
    const { snsId, email } = userData;
    const result = await this.authService.loginSns(snsId, email);
    console.log(result);
    return res.redirect('/v1');
  }

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  async register(@Body() body: SignUpDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    return await this.authService.login(email, password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 로그아웃' })
  async logout(@CurrentUser() user: User) {
    return await this.authService.logout(user.id);
  }

  @Post('token')
  @UseGuards(JwtRefreshTokenGuard)
  @ApiOperation({
    summary: 'Access_Token 재발급',
    description: 'Refresh_Token을 이용하여 사용자의 Access_Token을 재발급한다.',
  })
  async refreshAccessToken(@CurrentUser() user: User) {
    return await this.authService.refreshAccessToken(user);
  }
}
