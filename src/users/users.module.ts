import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UsersRepository } from './repository/users.repository';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsService } from './service/subscriptions.service';
import { Plan, PlanSchema } from '../plans/schema/plan.schema';
import { TransactionsModule } from '../transactions/transactions.module';
import { AuthService } from '../auth/service/auth.service';
import { PortOneService } from '../@api/portone.service';
import { PlansRepository } from '../plans/repository/plans.repository';
import { AuthRepository } from '../auth/repository/auth.repository';
import { HttpModule } from '@nestjs/axios';
import { PetsService } from '../pets/service/pets.service';
import { PetsRepository } from '../pets/reppository/pets.repository';
import { Pet, PetSchema } from '../pets/schema/pet.schema';
import { ImagesService } from '../images/service/images.service';
import { ImagesRepository } from '../images/repository/images.repository';
import { Image, ImageSchema } from '../images/schema/images.schema';
import { RelationRequest, RelationRequestSchema } from '../relationrequest/schema/relation.request.schema';
import { RelationRequestRepository } from '../relationrequest/repository/relation.request.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Pet.name, schema: PetSchema },
      { name: Image.name, schema: ImageSchema },
      { name: RelationRequest.name, schema: RelationRequestSchema },
    ]),
    TransactionsModule,
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    PetsService,
    PetsRepository,
    SubscriptionsService,
    AuthService,
    AuthRepository,
    PortOneService,
    PlansRepository,
    ImagesService,
    ImagesRepository,
    RelationRequestRepository,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
