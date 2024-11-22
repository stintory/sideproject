import { BadRequestException, Injectable } from '@nestjs/common';
import { PlansRepository } from '../repository/plans.repository';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  async createPaymentinfo(body) {
    try {
      const { name, price, tax } = body;
      const result = await this.plansRepository.create({
        name,
        price,
        tax,
      });

      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getPlanInfoAll() {
    try {
      const plans = await this.plansRepository.findPlanOrderBy();

      if (!plans) {
        throw new BadRequestException('Not exist plan');
      }

      const results = plans.map((plan) => plan);
      return {
        result: results,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getPlan(id: string) {
    try {
      const plan = await this.plansRepository.findById(id);
      if (!plan) {
        throw new BadRequestException('Not exist plan');
      }
      return {
        result: plan,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePlan(id: string, body) {
    try {
      const { name, price, tax } = body;
      const plan = await this.plansRepository.findById(id);
      if (!plan) {
        throw new BadRequestException('Not exist plan');
      }
      const result = await this.plansRepository.findByIdAndUpdate(plan.id, {
        name,
        price,
        tax,
      });

      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deletePlan(id: string) {
    try {
      const plan = await this.plansRepository.findById(id);
      if (!plan) {
        throw new BadRequestException('Not exist plan');
      }
      const result = await this.plansRepository.delete(plan.id);

      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
