import { Module } from '@nestjs/common';
import { PlansController } from './controller/plans.controller';
import { PlansService } from './service/plans.service';
import { PlansRepository } from './repository/plans.repository';
import { Plan, PlanSchema } from './schema/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }])],
  controllers: [PlansController],
  providers: [PlansService, PlansRepository],
  exports: [PlansRepository],
})
export class PlansModule {}
