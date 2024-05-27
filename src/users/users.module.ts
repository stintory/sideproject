import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UsersRepository } from './repository/users.repository';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsService } from './service/subscriptions.service';
import { Plan, PlanSchema } from '../plans/schema/plan.schema';
import { TransactionsModule } from '../transactions/transactions.module';
import { AuthService } from '../auth/service/auth.service';
import { PortOneService } from '../@api/portone.service';
import { PlansRepository } from '../plans/repository/plans.repository';
import { AuthRepository } from '../auth/repository/auth.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
    TransactionsModule,
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    SubscriptionsService,
    AuthService,
    AuthRepository,
    PortOneService,
    PlansRepository,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
