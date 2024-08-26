import { Controller, HttpCode, Get, Patch, Param, Body, UseGuards, Delete, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/@decorator/user.decorator';
import { User } from '../schema/user.schema';
import { ValidateMongoIdPipe } from 'src/@common/pipes/ValidateMongoIdPipe';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { SubscriptionsService } from '../service/subscriptions.service';
import { UpdateSubscriptionDto } from '../dto/update.subscription.dto';
import { CreateSubscriptionDto } from '../dto/create.subscription.dto';
import { PetsService } from '../../pets/service/pets.service';

@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly petsService: PetsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Get('/me')
  @HttpCode(200)
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '사용자 정보를 조회합니다.',
  })
  async getUser(@CurrentUser() user: User) {
    const petsResult = await this.petsService.findAll(user);
    console.log(petsResult);
    const pets = petsResult.result;
    const petInfo = await Promise.all(pets.map(async (pet) => [pet._id, pet.name, pet.age, pet.image]));
    const userResult = {
      ...user.getMe,
      petInfo,
    };
    return { data: userResult };
  }

  @Patch(':id')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다.',
  })
  async updateUser(@Param('id', ValidateMongoIdPipe) userId: string, @Body() body?: UpdateUserDto) {
    return await this.usersService.updateUser(userId, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '사용자 정보 삭제',
    description: '사용자 정보를 삭제합니다.',
  })
  async deleteUser(@Param('id', ValidateMongoIdPipe) userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  // subscription 조회
  @Get(':id/subscription')
  @ApiOperation({ summary: '유저 subscription 조회' })
  async getSubscription(@Param('id', ValidateMongoIdPipe) userId: string) {
    return await this.subscriptionsService.getSubscription(userId);
  }

  @Patch(':id/subscription')
  @ApiOperation({ summary: 'subscription 정기결제 on/off' })
  async updateSubscription(@Param('id', ValidateMongoIdPipe) userId: string, @Body() body: UpdateSubscriptionDto) {
    return await this.subscriptionsService.updateSubscription(userId, body);
  }

  @Post(':id/subscription')
  @ApiOperation({ summary: '포트원 실결제 요청' })
  async CreateSubscription(@Param('id', ValidateMongoIdPipe) userId: string, @Body() body: CreateSubscriptionDto) {
    return await this.subscriptionsService.CreateSubscription(userId, body);
  }
}
