import { Module } from '@nestjs/common';
import { PetsController } from './controller/pets.controller';
import { PetsService } from './service/pets.service';
import { PetsRepository } from './reppository/pets.repository';
import { Pet, PetSchema } from './schema/pet.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
  exports: [PetsRepository],
})
export class PetsModule {}
