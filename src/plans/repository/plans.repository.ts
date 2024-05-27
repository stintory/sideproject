import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan } from '../schema/plan.schema';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class PlansRepository {
  constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {}

  async create(plan: Partial<Plan>): Promise<Plan> {
    return await this.planModel.create(plan);
  }

  async findPlanOrderBy(): Promise<Plan[] | null> {
    return await this.planModel.find({ status: true }).sort({ orderby: 1 });
  }
  async findAll(): Promise<Plan[]> {
    return await this.planModel.find({}).exec();
  }

  async find(query: FilterQuery<Plan>): Promise<Plan[]> {
    return await this.planModel.find(query).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Plan> {
    return await this.planModel.findById(id).exec();
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, updateObject: Partial<Plan>): Promise<Plan> {
    return await this.planModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Plan> {
    return await this.planModel.findByIdAndDelete(id).exec();
  }
}
