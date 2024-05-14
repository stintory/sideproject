import { Controller, HttpCode, Get, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/@decorator/user.decorator';
import { User } from '../schema/user.schema';
import { ValidateMongoIdPipe } from 'src/@common/pipes/ValidateMongoIdPipe';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @HttpCode(200)
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '사용자 정보를 조회합니다.',
    tags: ['Working'],
  })
  async getUser(@CurrentUser() user: User) {
    return {
      result: user.readOnlyData,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다.',
  })
  async updateUser(
    @Param('id', ValidateMongoIdPipe) userId: string,
    @Body() body?: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(userId, body);
  }
}
