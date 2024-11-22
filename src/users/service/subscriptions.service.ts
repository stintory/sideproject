import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PortOneService } from '../../@api/portone.service';
import { PlansRepository } from '../../plans/repository/plans.repository';
import { UsersRepository } from '../repository/users.repository';
import { UpdateSubscriptionDto } from '../dto/update.subscription.dto';
import {
  calculateAmount,
  generateMerchantUid,
  getCurrencyByPG,
  getPaymentDates,
} from '../../@utils/subscription.utils';
import { CreateSubscriptionDto } from '../dto/create.subscription.dto';
import { AgainResponse } from '../../@api/portone.interface';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly portOneService: PortOneService,
    private readonly plansRepository: PlansRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  // user의 subscription 정보 조회
  async getSubscription(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      result: user.subscriptionInfo,
      message: 'Subscription found succenssfully',
    };
  }

  //유저의 정기결제 정보 업데이트 (정기결제 on/off)
  async updateSubscription(userId: string, body: UpdateSubscriptionDto) {
    const { enabled } = body;
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 현재 프로젝트가 무료플랜이면 계약을 진행하지 않음
    const plan = await this.plansRepository.findById(user.planId.toString());
    if (plan.name === 'free') {
      throw new BadRequestException('Subscription is not commercial plan');
    }

    if (enabled) {
      if (user.subscription.merchantUid !== null) {
        //merchantUid 가 존재한다면 기존에 정기결제 취소가 제대로 되지 않은 상황.
        throw new InternalServerErrorException('기존 정기결제 취소 학인');
      }

      const customerUid = user.subscription.customerUid;
      const merchantUid = generateMerchantUid(user._id.toString());
      const nextPaymenrDate = new Date(user.subscription.nextPayment);
      const amount = calculateAmount(user.subscription.pgProvider, plan);
      const currency = getCurrencyByPG(user.subscription.pgProvider);

      const { code, message } = await this.portOneService.schedulePayment(customerUid, merchantUid, {
        scheduleDate: nextPaymenrDate,
        amount,
        currency,
      });

      // 결제 성공시 '0' : 참조(https://developers.portone.io/api/rest-v1/nonAuthPayment.subscribe)
      if (code === 0) {
        const updateUser = await this.usersRepository.updateById(user.id, {
          'subscription.merchantUid': merchantUid,
          'subscription.enabled': true,
        });

        return {
          message: 'Schedule subscription successfully updated',
          result: updateUser.subscriptionInfo,
        };
      } else {
        console.log(`[portone] 정기결제 예약 실패 : ${message}`);
        throw new InternalServerErrorException(message);
      }
    } else {
      const customerUid = user.subscription.customerUid;
      const merchantUid = user.subscription.merchantUid;
      const { code, message } = await this.portOneService.unSubscribeSchedule(customerUid, merchantUid);

      // 정기결제 예약 취소 성공시 '0'
      if (code === 0) {
        const updateUser = await this.usersRepository.updateById(user.id, {
          'subscription.merchantUid': null,
          'subscription.enabled': false,
        });

        return {
          message: 'Cancel subscription successfully',
          result: { ...updateUser.subscriptionInfo },
        };
      } else {
        console.log(`[portone] 정기결제 예약 취소 실패 : ${message}`);
        throw new InternalServerErrorException();
      }
    }
  }

  async CreateSubscription(userId: string, body: Partial<CreateSubscriptionDto>) {
    const { customerUid, pgProvider, planId, buyerCompany, buyerName, buyerEmail, buyerTel } = body;
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const plan = await this.plansRepository.findById(planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const merchantUid = generateMerchantUid(user.id.toString());
    // PG(페이팔, 이니시스)에 따라 올바른 통화 단위로 걸제를 진행.
    const amount = calculateAmount(pgProvider, plan);
    const currency = getCurrencyByPG(pgProvider);
    const result: AgainResponse = await this.portOneService.againPayment(customerUid, merchantUid, {
      buyerTel,
      buyerEmail,
      buyerName,
      buyerCompany,
      amount,
      currency,
    });

    const { code, message } = result;
    if (code === 0) {
      const { status } = result.response;
      if (status === 'paid') {
        const { paymentDate, nextPaymentDate } = getPaymentDates();

        return {
          result: {
            nextPayment: nextPaymentDate,
            lastPayment: paymentDate,
            planId: planId,
            merchantUid: merchantUid,
          },
          message: 'Payment and reserve subscription success',
        };
      }
    } else {
      console.log(`[portone] 결제 실패 : ${message}`);
      throw new InternalServerErrorException();
    }
  }
}
