import { Module } from '@nestjs/common';
import { PetsController } from './controller/pets.controller';
import { PetsService } from './service/pets.service';
import { PetsRepository } from './reppository/pets.repository';
import { Pet, PetSchema } from './schema/pet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesService } from '../images/service/images.service';
import { ImageSchema, Image } from '../images/schema/images.schema';
import { ImagesRepository } from '../images/repository/images.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository, ImagesService, ImagesRepository],
  exports: [PetsRepository],
})
export class PetsModule {}
