import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RelationRequest, RelationRequestSchema } from './schema/relation.request.schema';
import { RelationRequestRepository } from './repository/relation.request.repository';
import { RelationrequestController } from './controller/relationrequest.controller';
import { RelationrequestService } from './service/relationrequest.service';
import { UsersRepository } from '../users/repository/users.repository';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RelationRequest.name, schema: RelationRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RelationrequestController],
  providers: [RelationRequestRepository, RelationrequestService, UsersRepository],
  exports: [RelationRequestRepository],
})
export class RelationRequestModule {}
