import { Module } from '@nestjs/common';
import { GrowthRepotsController } from './controller/growth-repots.controller';
import { GrowthRepotsService } from './service/growth-repots.service';

@Module({
  controllers: [GrowthRepotsController],
  providers: [GrowthRepotsService]
})
export class GrowthRepotsModule {}
