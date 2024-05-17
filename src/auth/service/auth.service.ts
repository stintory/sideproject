import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/repository/users.repository';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '../../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private readonly authRepository: AuthRepository) {}

  async validateUser(payload: any): Promise<User | null> {
    const { sub } = payload;
    const user = await this.usersRepository.findById(sub);
    return user;
  }

  async validateKakaoUser(provider: string, snsId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ provider, snsId });
    return user;
  }

  async login(userData: User) {
    const { provider, snsId, email } = userData;

    return userData;
  }
}

//
// async kakaoLogin(code: string) {
//   try {
//     // 카카오로부터 받은 인가 코드를 사용하여 인증 토큰을 요청
//     const tokenResponse = await this.requestKakaoAccessToken(code);
//
//     // 받은 토큰을 이용하여 사용자 정보를 가져오기
//     const userInfoResponse = await this.requestKakaoUserInfo(tokenResponse.access_token);
//
//     // 필요한 사용자 정보를 추출하여 JSON 형식으로 반환
//     const userInfo = this.extractUserInfo(userInfoResponse);
//
//     return userInfo;
//   } catch (error) {
//     console.error('카카오 로그인 요청에 실패했습니다:', error.response.data);
//     throw new InternalServerErrorException('카카오 로그인 요청에 실패했습니다');
//   }
// }
//
// // 카카오로부터 인가 코드를 이용하여 인증 토큰을 요청하는 메서드
// private async requestKakaoAccessToken(code: string) {
//   const data = {
//     grant_type: 'authorization_code',
//     client_id: process.env.KAKAO_CLIENT_ID,
//     redirect_uri: process.env.REDIRECT_URL,
//     code,
//   };
//
//   const params = new URLSearchParams(data).toString();
//   const config = {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
//   };
//
//   const tokenUrl = `https://kauth.kakao.com/oauth/token`;
//   const response = await this.httpService.axiosRef.post(tokenUrl, params, config);
//   return response.data;
// }
//
// // 토큰을 이용하여 사용자 정보를 가져오는 메서드
// private async requestKakaoUserInfo(accessToken: string) {
//   const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
//   const config = {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   };
//   const response = await this.httpService.axiosRef.get(userInfoUrl, config);
//   return response.data;
// }
//
// // 사용자 정보에서 필요한 부분만 추출하여 반환하는 메서드
// private extractUserInfo(userInfo: any) {
//   const { id, kakao_account } = userInfo;
//   return {
//     id,
//     email: kakao_account.email,
//     nickname: kakao_account.profile.nickname,
//     photo: kakao_account.profile.image_url,
//   };
// }
// }
