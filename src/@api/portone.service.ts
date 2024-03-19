import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  GetPaymentInfoResponse,
  GetTokenRequestBody,
  GetTokenResponse,
  AgainRequestBody,
  AgainResponse,
  ScheduleRequestBody,
  ScheduleResponse,
  UnScheduleRequestBody,
  UnScheduleResponse,
  ExecutePaymentInfo,
  SchedulePaymentInfo,
} from './portone.interface';

@Injectable()
export class PortOneService {
  private readonly apiBaseUrl = 'https://api.iamport.kr';

  constructor(private httpService: HttpService) {}

  /** Import 결제를 위한 Access Token을 얻어옴. */
  async getAccessToken() {
    try {
      const { IMP_API_KEY, IMP_SECRET_KEY } = process.env;

      const url = `${this.apiBaseUrl}/users/getToken`;

      const data: GetTokenRequestBody = {
        imp_key: IMP_API_KEY,
        imp_secret: IMP_SECRET_KEY,
      };

      const response = await this.httpService.axiosRef.post<GetTokenResponse>(url, data);

      const { access_token } = response.data.response;

      return access_token;
    } catch (error) {
      console.error('PortOne: 토큰 발급시 에러 발생', error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * 실결제 진행
   * 참고 : https://github.com/iamport/iamport-manual/blob/master/%EB%B9%84%EC%9D%B8%EC%A6%9D%EA%B2%B0%EC%A0%9C/example/payjoa-api-billing-key.md
   * @param customerUid 결제 고객 정보 (아임포트 서버의 빌링키와 1:1 관계)
   * @param merchantUid 결제당 부여되는 고유 ID (결제 상태,금액,정기결제 예약 조회 등 조회 가능)
   * @param paymentsInfo 결제 요청 정보
   */
  async againPayment(customerUid: string, merchantUid: string, paymentsInfo: ExecutePaymentInfo) {
    try {
      const { buyerName, buyerEmail, buyerTel, amount, buyerCompany } = paymentsInfo;

      const accessToken = await this.getAccessToken();

      const url = `${this.apiBaseUrl}/subscribe/payments/again`;

      const data: AgainRequestBody = {
        customer_uid: customerUid,
        merchant_uid: merchantUid,
        amount,
        name: '라이센스 구매 초기 결제',
        buyer_email: buyerEmail ? buyerEmail : undefined,
        buyer_name: buyerName ? buyerName : undefined,
        buyer_tel: buyerTel ? buyerTel : undefined,
        custom_data: {
          buyer_company: buyerCompany ? buyerCompany : undefined,
        },
      };

      const config = {
        headers: {
          Authorization: accessToken,
        },
      };

      const response = await this.httpService.axiosRef.post<AgainResponse>(url, data, config);

      return response.data;
    } catch (error) {
      console.error('PortOne: 실결제 요청 시 에러 발생', error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * 참고:  https://api.iamport.kr/
   * 결제에 대한 상세정보를 얻어옴.
   * 즉 이니시스 결제창에서 입력한 정보를 가져오기 위해 보통 사용됨.
   * @param impUid Iamport에서 결제당 부여되는 고유 ID (구매자정보, 상품정보, 결제 취소 )
   */
  async getPaymentInfo(impUid: string) {
    try {
      const accessToken = await this.getAccessToken();

      const url = `${this.apiBaseUrl}/payments/${impUid}`;

      const config = {
        headers: {
          Authorization: accessToken,
        },
      };

      const response = await this.httpService.axiosRef.get<GetPaymentInfoResponse>(url, config);

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * 정기결제 예약 취소
   * @param customerUid customerUid 결제 고객 정보 (아임포트 서버의 빌링키와 1:1 관계)
   * @param merchantUid 정기결제를 중지시킬 거래 고유 ID
   */
  async unSubscribeSchedule(customerUid: string, merchantUid?: string) {
    try {
      const accessToken = await this.getAccessToken();

      const url = `${this.apiBaseUrl}/subscribe/payments/unschedule`;

      const data: UnScheduleRequestBody = {
        customer_uid: customerUid,
        merchant_uid: merchantUid,
      };

      // merchant_uid가 존재하지 않으면 해당 빌링키를 이용한 정기결제 모두 제거.
      if (merchantUid === undefined || merchantUid === '') {
        delete data.merchant_uid;
      }

      const config = {
        headers: {
          Authorization: accessToken,
        },
      };

      const response = await this.httpService.axiosRef.post<UnScheduleResponse>(url, data, config);

      return response.data;
    } catch (error) {
      console.error('PortOne: 정기결제 예약 취소 시 에러 발생', error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * 정기 결제 예약
   * @param customerUid customerUid 결제 고객 정보 (아임포트 서버의 빌링키와 1:1 관계)
   * @param merchantUid 결제 고유 ID (정기 결제 ID)
   * @param paymentInfo 결제 정보
   */
  async schedulePayment(customerUid: string, merchantUid: string, paymentInfo: SchedulePaymentInfo) {
    try {
      const accessToken = await this.getAccessToken();

      const { IMP_WEBHOOK_URL } = process.env;

      const { scheduleDate, amount, buyerName, buyerTel, buyerEmail, buyerCompany, currency } = paymentInfo;

      const url = `${this.apiBaseUrl}/subscribe/payments/schedule`;

      const data: ScheduleRequestBody = {
        customer_uid: customerUid,
        schedules: [
          {
            merchant_uid: merchantUid,
            schedule_at: scheduleDate.getTime() / 1000,
            amount,
            currency: currency ? currency : 'KWR',
            notice_url: IMP_WEBHOOK_URL,
            name: '월간 이용권 정기결제',
            buyer_email: buyerEmail ? buyerEmail : undefined,
            buyer_name: buyerName ? buyerName : undefined,
            buyer_tel: buyerTel ? buyerTel : undefined,
            custom_data: {
              buyer_company: buyerCompany ? buyerCompany : undefined,
            },
          },
        ],
      };

      const config = {
        headers: {
          Authorization: accessToken,
        },
      };

      const response = await this.httpService.axiosRef.post<ScheduleResponse>(url, data, config);

      return response.data;
    } catch (error) {
      console.error('PortOne: 정기결제 예약 시 에러 발생', error);
      throw new InternalServerErrorException();
    }
  }
}
