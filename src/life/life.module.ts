import { Module } from '@nestjs/common';
import { LifeController } from './controller/life.controller';
import { LifeService } from './service/life.service';

@Module({
  controllers: [LifeController],
  providers: [LifeService]
})
export class LifeModule {}
