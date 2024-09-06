import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RelationRequest, RelationRequestSchema } from './schema/relation.request.schema';
import { RelationRequestRepository } from './repository/relation.request.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: RelationRequest.name, schema: RelationRequestSchema }])],
  controllers: [],
  providers: [RelationRequestRepository],
  exports: [RelationRequestRepository],
})
export class RelationRequestModule {}
