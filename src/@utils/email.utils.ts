import { InternalServerErrorException } from '@nestjs/common';
const letseeDeveloperHomepageURL = process.env.LETSEE_DEVELOPER_HOMEPAGE_URL;

export function createSignupEmailHTML(token: string, locale: string) {
  if (locale === 'ko') {
    return `
      <div style="background: #F8F8F9; padding:20px 0 0 0; font-family:Noto Sans KR, Nanum Gothic, Dotum, Helvetica, AppleGothic, Helvetica, Sans-serif; color:#333333;" align="center">
        <div style="max-width:600px; margin:0 auto ">
          <table style="width:100%; background: #FFFFFF; border-collapse: collapse;" align="center" border="0"
                 cellPadding="0" cellSpacing="0">
            <tr>
              <td style="padding:40px 20px 20px 20px; ">
  
                <!--렛시 로고 클릭시 렛시 홈페이지로 이동-->
                <div style="text-align: center;"><a href="https://www.letsee.io/ko/" target="_blank"><img
                    src="https://cdn.letsee.io/signature/letsee_w.png" style="width:148px;" alt="렛시로고"></a></div>
  
                <!-- 회원가입시 -->
                <div style="text-align: center; font-size: 16px; padding:12px 20px 22px 20px;">
                  <p style="padding:0; margin:0;">Letsee for Developers 사이트의</p>
                  <p style="padding:0; margin:0; font-weight: bold; color: #483F96;">회원가입이 신청 되었습니다.</p>
                </div>
                <div style="background: #FAF8FF; padding:10px 20px 20px 20px; text-align: center;">
                  <p style="font-size: 14px;">아래 버튼을 클릭하여 계정 인증을 완료해 주세요. <br> Letsee for Developers 서비스로 이동됩니다.</p>
                  <!--버튼-->
                  <div style="padding:32px 0; width:100%; text-align: center;">
                    <a
                      href="${letseeDeveloperHomepageURL}/user/login?key=${encodeURIComponent(token)}"
                      target="_blank"
                      style="
                        width:180px;
                        height:37px;
                        padding: 11px 40px 15px 40px;
                        background: #483F96;
                        -moz-border-radius:35px;
                        -webkit-border-radius:35px;
                        border-radius:35px;
                        text-align: center;
                        font-weight: bold;
                        font-size:16px;
                        color:#ffffff;
                        text-decoration: none;">계정 인증하기
                      </a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <!-- 풋터 안내 내용과 이메일 링크 -->
          <div style="padding:20px; margin:0; color:#666666; line-height: 130%; text-align: center;">
            <p style="padding:0; margin:0; font-size:12px;">본 메일은 발송전용으로 회신되지 않습니다.<br>
              문의는 <a href="mailto:contact@letsee.io" style='font-weight: bold; text-decoration: underline; color: #666666;'>이메일</a>을 통해서 남겨주세요.
            </p>
            <p style="padding:10px 0 0 0; margin:0; font-size:10px;">Copyright © <strong>Letsee</strong>, Inc. All rights reserved</p>
          </div>
        </div>
      </div>
     `;
  } else if (locale === 'en') {
    return `
      <div style="background: #F8F8F9; padding:20px 0 0 0; font-family:Noto Sans KR, Nanum Gothic, Dotum, Helvetica, AppleGothic, Helvetica, Sans-serif; color:#333333;" align="center">
        <div style="max-width:600px; margin:0 auto ">
          <table style="width:100%; background: #FFFFFF; border-collapse: collapse;" align="center" border="0"
                 cellPadding="0" cellSpacing="0">
            <tr>
              <td style="padding:40px 20px 20px 20px; ">
  
                <!--렛시 로고 클릭시 렛시 홈페이지로 이동-->
                <div style="text-align: center;"><a href="https://www.letsee.io/ko/" target="_blank"><img
                    src="https://cdn.letsee.io/signature/letsee_w.png" style="width:148px;" alt="Letsee's logo"></a></div>
  
                <!-- 회원가입시 -->
                <div style="text-align: center; font-size: 16px; padding:12px 20px 22px 20px;">
                  <p style="padding:0; margin:0;">Letsee for Developers site's</p>
                  <p style="padding:0; margin:0; font-weight: bold; color: #483F96;">Registration completed successfully.</p>
                </div>
                <div style="background: #FAF8FF; padding:10px 20px 20px 20px; text-align: center;">
                  <p style="font-size: 14px;">Click the button below to verify your account. <br> You will be taken to the Letsee for Developers service.</p>
                  <!--버튼-->
                  <div style="padding:32px 0; width:100%; text-align: center;">
                    <a
                      href="${letseeDeveloperHomepageURL}/user/login?key=${encodeURIComponent(token)}"
                      target="_blank"
                      style="
                        width:180px;
                        height:37px;
                        padding: 11px 40px 15px 40px;
                        background: #483F96;
                        -moz-border-radius:35px;
                        -webkit-border-radius:35px;
                        border-radius:35px;
                        text-align: center;
                        font-weight: bold;
                        font-size:16px;
                        color:#ffffff;
                        text-decoration: none;">Verify your account
                      </a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <!-- 풋터 안내 내용과 이메일 링크 -->
          <div style="padding:20px; margin:0; color:#666666; line-height: 130%; text-align: center;">
            <p style="padding:0; margin:0; font-size:12px;">This mail is only for sending, you cannot reply.<br>
              If you have any question, please send us via <a href="mailto:contact@letsee.io" style='font-weight: bold; text-decoration: underline; color: #666666;'>email</a>
            </p>
            <p style="padding:10px 0 0 0; margin:0; font-size:10px;">Copyright © <strong>Letsee</strong>, Inc. All rights reserved</p>
          </div>
        </div>
      </div>
     `;
  } else {
    throw new InternalServerErrorException('Email Template error.');
  }
}
export function createPassWordResetEmailHTML(token: string, locale: string): string {
  if (locale === 'ko') {
    return `
      <div
          style="
            background: #F8F8F9;
            padding:20px 0 0 0;
            font-family:Noto Sans KR, Nanum Gothic, Dotum, Helvetica, AppleGothic, Helvetica, Sans-serif;
            color:#333333
          ">
        <div style="max-width:600px; margin:0 auto ">
          <table style="width:100%; background: #FFFFFF; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding:40px 20px 20px 20px; ">
  
                  <!--렛시 로고 클릭시 렛시 홈페이지로 이동-->
                  <div style="text-align: center;">
                    <a href="https://www.letsee.io/ko/" target="_blank">
                      <img
                        src="https://cdn.letsee.io/signature/letsee_w.png"
                        style="width:148px;"
                        alt="렛시로고">
                      </a>
                  </div>
  
                  <!-- 회원가입시 -->
                  <div style="text-align: center; font-size: 16px; padding:12px 20px 22px 20px;">
                    <p style="padding:0; margin:0;">Letsee for Developers 사이트의</p>
                    <p style="padding:0; margin:0; font-weight: bold; color: #483F96;">비밀번호를 다시 설정해 주세요.</p>
                  </div>
                  <div style="background: #FAF8FF; padding:10px 20px 20px 20px; text-align: center;">
                    <p style="font-size: 14px;">아래 버튼을 클릭하여 비밀번호를 재설정 해주세요.<br>Letsee for Developers 서비스로 이동됩니다.</p>
                          <!--버튼-->
                        <div style="padding:32px 0; width:100%; text-align: center;">
                          <a href="${letseeDeveloperHomepageURL}/user/login?key=${encodeURIComponent(token)}"
                            target="_blank"
                            style="
                            width:180px;
                            height:37px;
                            padding: 11px 40px 15px 40px;
                            background: #483F96;
                            -moz-border-radius:35px;
                            -webkit-border-radius:35px;
                            border-radius:35px;
                            text-align: center;
                            font-weight: bold;
                            font-size:16px;
                            color:#ffffff;
                            text-decoration: none;">계정 인증하기
                          </a>
                        </div>
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <!-- 풋터 안내 내용과 이메일 링크 -->
            <div style="padding:20px; margin:0; color:#666666; line-height: 130%; text-align: center;">
              <p style="padding:0; margin:0; font-size:12px;">
                본 메일은 발송전용으로 회신되지 않습니다.<br>
                문의는 <a href="mailto:contact@letsee.io" style='font-weight: bold; text-decoration: underline; color: #666666;'>이메일</a>을 통해서 남겨주세요.
              </p>
              <p style="padding:10px 0 0 0; margin:0; font-size:10px;">Copyright © <strong>Letsee</strong>, Inc. All rights reserved</p>
          </div>
        </div>
      </div>
    `;
  } else if (locale === 'en') {
    return `
      <div
          style="
            background: #F8F8F9;
            padding:20px 0 0 0;
            font-family:Noto Sans KR, Nanum Gothic, Dotum, Helvetica, AppleGothic, Helvetica, Sans-serif;
            color:#333333
          ">
        <div style="max-width:600px; margin:0 auto ">
          <table style="width:100%; background: #FFFFFF; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding:40px 20px 20px 20px; ">
  
                  <!--렛시 로고 클릭시 렛시 홈페이지로 이동-->
                  <div style="text-align: center;">
                    <a href="https://www.letsee.io/ko/" target="_blank">
                      <img
                        src="https://cdn.letsee.io/signature/letsee_w.png"
                        style="width:148px;"
                        alt="Letsee's logo">
                      </a>
                  </div>
  
                  <!-- 회원가입시 -->
                  <div style="text-align: center; font-size: 16px; padding:12px 20px 22px 20px;">
                    <p style="padding:0; margin:0;">Letsee for Developers site's</p>
                    <p style="padding:0; margin:0; font-weight: bold; color: #483F96;">Please reset your password.</p>
                  </div>
                  <div style="background: #FAF8FF; padding:10px 20px 20px 20px; text-align: center;">
                    <p style="font-size: 14px;">Click the button below to reset your password.<br>You will be taken to the Letsee for Developers service.</p>
                          <!--버튼-->
                        <div style="padding:32px 0; width:100%; text-align: center;">
                          <a href="${letseeDeveloperHomepageURL}/user/login?key=${encodeURIComponent(token)}"
                            target="_blank"
                            style="
                            width:180px;
                            height:37px;
                            padding: 11px 40px 15px 40px;
                            background: #483F96;
                            -moz-border-radius:35px;
                            -webkit-border-radius:35px;
                            border-radius:35px;
                            text-align: center;
                            font-weight: bold;
                            font-size:16px;
                            color:#ffffff;
                            text-decoration: none;">Verify your account
                          </a>
                        </div>
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <!-- 풋터 안내 내용과 이메일 링크 -->
            <div style="padding:20px; margin:0; color:#666666; line-height: 130%; text-align: center;">
              <p style="padding:0; margin:0; font-size:12px;">
                This mail is only for sending, you cannot reply.<br>
                If you have any question, please send us via <a href="mailto:contact@letsee.io" style='font-weight: bold; text-decoration: underline; color: #666666;'>email</a>
              </p>
              <p style="padding:10px 0 0 0; margin:0; font-size:10px;">Copyright © <strong>Letsee</strong>, Inc. All rights reserved</p>
            </div>
          </div>
        </div>
    `;
  } else {
    throw new InternalServerErrorException('Email Template error.');
  }
}
