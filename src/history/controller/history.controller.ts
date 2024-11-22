import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistoryService } from '../service/history.service';
import { User } from '../../users/schema/user.schema';
import { CreateHistoryDto } from '../dto/create.history.dto';
import { CurrentUser } from '../../@decorator/user.decorator';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdateHistoryDto } from '../dto/update.history.dto';

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

  @Get()
  @ApiOperation({ summary: '애견 히스토리 전체 조회' })
  async getAllHistory(@CurrentUser() user: User) {
    const result = await this.historyService.getAllHistory(user);
    return { result };
  }

  @Get(':id')
  @ApiOperation({ summary: '애견 히스토리 단건 조회' })
  async getHistory(@Param('id', ValidateMongoIdPipe) id: string) {
    const result = await this.historyService.getHistory(id);
    return { result };
  }

  @Patch(':id')
  @ApiOperation({ summary: '애견 히스토리 수정' })
  async updateHistory(@Param('id', ValidateMongoIdPipe) id: string, @Body() body: UpdateHistoryDto) {
    const { title, content } = body;

    const result = await this.historyService.updateHistory(id, title, content);
    return { result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '애견 히스토리 삭제' })
  async deleteHistory(@Param('id', ValidateMongoIdPipe) id: string) {
    const result = await this.historyService.deleteHistory(id);
    return { result };
  }
}
