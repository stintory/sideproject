// 현재 날짜 및 다음 결제일 계산
import moment from 'moment/moment';
import { Types } from 'mongoose';
import { Plan } from '../plans/schema/plan.schema';

/** 다음달 한국시간 10시에 다음 결제일 생성, 해당 날짜에 정기결제 Transaction 예약 **/
export function getPaymentDates(): {
  paymentDate: Date;
  nextPaymentDate: Date;
} {
  const paymentDate = new Date();
  // 현재 한국의 Timezone을 기준으로 가져온 날짜의 1달후에 다음 정기결제일 계산.
  const nextPaymentDate = moment().tz('Asia/Seoul').add(1, 'months').set({ hour: 10, minute: 0, second: 0 }).toDate();
  return { paymentDate, nextPaymentDate };

  /** 글로벌 서비스를 고려하는 경우 UTC 시간으로 수정하여야 함. 한국시간을 기준으로 1달을 정하는게 아닌 UTC n시 기준으로 날짜가 계산된다고 명시하여야함. **/
  // const nextPaymentDate = moment().tz('UTC').add(1, 'months').set({ hour: 1, minute: 0, second: 0 }).toDate();
}

/** 상점 아이디 생성 **/
export function generateMerchantUid(projectId: string | Types.ObjectId): string {
  return projectId + '_' + new Date().getTime();
}

export function getProjectIdByMerchantUid(merchantUid: string) {
  return merchantUid.split('_')[0];
}

/** PG에 따라 실결제 금액 반환 **/
export function calculateAmount(pgProvider: string, plan: Plan): number {
  if (pgProvider === 'paypal_v2') return Math.floor(Number(plan.price.USD) * 1.1);
  if (pgProvider === 'inisis') return Math.floor(Number(plan.price.KRW) * 1.1);
}

/** PG에 따라 통화 단위 반환 **/
export function getCurrencyByPG(pgProvider: string): 'USD' | 'KWR' {
  return pgProvider === 'paypal_v2' ? 'USD' : 'KWR';
}
