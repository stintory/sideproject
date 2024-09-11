import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { RelationrequestService } from '../service/relationrequest.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';

@Controller('relation')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Relation')
export class RelationrequestController {
  constructor(private readonly relationService: RelationrequestService) {}
  // 관계 요청 중인 목록 조회
  @Get('/request/sent')
  async getRequestList(@CurrentUser() user: User) {
    // TODO: DB에서 관계 요청 목록을 가져와서 return
    return await this.relationService.getRequestList(user);
  }
  // 관계 요청 받은 목록 조회
  @Get('/request/received')
  async getReceivedRequestList(@CurrentUser() user: User) {
    // TODO: DB에서 관계 요청 받은 목록을 가져와서 return
    return await this.relationService.getReceivedList(user);
  }

  // 수락한 관계 목록 보기
  @Get('/request/status')
  async getAcceptedList(@CurrentUser() user: User, @Query('status') status: string) {
    return await this.relationService.getAcceptedList(user, status);
  }

  // 차단한 관계 목록 보기
  @Get('/request/blocklist')
  async getBanList() {
    // TODO: DB에서 ��단한 관계 목록을 가져와서 return
  }
}
