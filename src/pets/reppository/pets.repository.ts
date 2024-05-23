import { Injectable } from '@nestjs/common';
import { Pet } from '../schema/pet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class PetsRepository {
  constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}

  async create(pet: Partial<Pet>): Promise<Pet> {
    // const newPet = new this.petModel(pet);
    // return newPet.save();
    return await this.petModel.create(pet);
  }

  async findAll(userId: string | Types.ObjectId) {
    return await this.petModel.find({ userId }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Pet> {
    return await this.petModel.findById(id).exec();
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, updateObject: Partial<Pet>): Promise<Pet> {
    return await this.petModel.findByIdAndUpdate(id, updateObject, { new: true }).exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Pet> {
    return await this.petModel.findByIdAndDelete(id).exec();
  }
}
