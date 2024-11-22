import { Module } from '@nestjs/common';
import { HistoryService } from './service/history.service';
import { HistoryController } from './controller/history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from '../pets/schema/pet.schema';
import { History, HistorySchema } from './schema/history.schema';
import { HistoryRepository } from './repository/history.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema },
      { name: History.name, schema: HistorySchema },
    ]),
  ],
  providers: [HistoryService, HistoryRepository],
  controllers: [HistoryController],
})
export class HistoryModule {}
