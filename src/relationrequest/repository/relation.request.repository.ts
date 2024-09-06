import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RelationRequest } from '../schema/relation.request.schema';
import { Model } from 'mongoose';
import { CreateRelationRequestDto } from '../dto/create.relation.request.dto';

@Injectable()
export class RelationRequestRepository {
  constructor(@InjectModel(RelationRequest.name) private relationRequestModel: Model<RelationRequest>) {}

  // 관계 요청 생성.
  async create(CreateRelationRequestDto: Partial<RelationRequest>): Promise<RelationRequest> {
    const createRequest = new this.relationRequestModel(CreateRelationRequestDto);
    return createRequest.save();
  }

  // 관계 요청 조회
  async findOne(condition: any): Promise<RelationRequest | null> {
    return await this.relationRequestModel.findOne(condition).exec();
  }

  // 관계 요청 업데이트
  async updateOne(condition: any, updatge: any): Promise<any> {
    return await this.relationRequestModel.updateOne(condition, updatge).exec();
  }

  //관계 요청 삭제
  async deleteOne(conditon: any): Promise<any> {
    return await this.relationRequestModel.deleteOne(conditon).exec();
  }

  async deleteMany(conditon: any): Promise<any> {
    return await this.relationRequestModel.deleteMany(conditon).exec();
  }
}
