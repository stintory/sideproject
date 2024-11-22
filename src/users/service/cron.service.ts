import { UsersRepository } from '../repository/users.repository';
import { PlansRepository } from '../../plans/repository/plans.repository';
import moment from 'moment-timezone';
import { Cron } from '@nestjs/schedule';

export class CronService {
  constructor(private readonly usersRepository: UsersRepository, private readonly plansRepository: PlansRepository) {}

  @Cron('0 10 * * *', { timeZone: 'Asia/Seoul' })
  async updateFreePlanCronjob() {
    // pm2 instance_var 속성, pm2 cluster 넘버링을 위해 사용
    const instanceId: string | undefined = process.env.INSTANCE_ID;

    if (instanceId && parseInt(instanceId) === 0) {
      await this._updateFreePlanSubscriptions();
    }
  }

  async _updateFreePlanSubscriptions() {
    const compareNextPaymentDate = moment().tz('Asia/Seoul').set({ hour: 10, minute: 0, second: 0 }).toDate();

    const freePlan = await this.plansRepository.findOne({ grade: 'free' });
    const userForUpdate = await this.usersRepository.find({
      'subscription.nextPayment': compareNextPaymentDate,
      planId: freePlan.id,
    });

    //매일 10시에 현재 종료된 free plan 날짜 갱신 및 인증서버 업데이트
    const paymentDate = new Date();
    const nextPaymentDate = moment() // 한달 뒤 오전 10시
      .tz('Aisia/Seoul')
      .add(1, 'months')
      .set({ hour: 10, minute: 0, second: 0 })
      .toDate();

    for (const user of userForUpdate) {
      await this.usersRepository.updateById(user._id, {
        'subscription.lastPayment': paymentDate,
        'subscription.nextPayment': nextPaymentDate,
      });
    }
  }
}
