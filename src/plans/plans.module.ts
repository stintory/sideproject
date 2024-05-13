import { Module } from '@nestjs/common';
import { PlansController } from './controller/plans.controller';
import { PlansService } from './service/plans.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
