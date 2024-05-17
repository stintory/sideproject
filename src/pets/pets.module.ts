import { Module } from '@nestjs/common';
import { PetsController } from './controller/pets.controller';
import { PetsService } from './service/pets.service';

@Module({
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
