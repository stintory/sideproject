import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistoryService } from '../service/history.service';
import { User } from '../../users/schema/user.schema';
import { CreateHistoryDto } from '../dto/create.history.dto';
import { CurrentUser } from '../../@decorator/user.decorator';

@Controller('history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @ApiOperation({ summary: '애견 히스토리 등록' })
  async createHistory(@CurrentUser() user: User, @Body() body: CreateHistoryDto) {
    const { title, content } = body;

    const result = await this.historyService.createHistory(user, title, content);
    return { result };
  }

  @Post()
  @ApiOperation({ summary: '애견 스토리 전체 조회' })
  async getAllHistory(@CurrentUser() user: User) {
    const result = await this.historyService.getAllHistory(user);
    return { result };
  }
}
