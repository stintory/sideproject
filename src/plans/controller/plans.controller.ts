import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PlansService } from '../service/plans.service';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePlanDto } from '../dto/create.plan.dto';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdatePlanDto } from '../dto/update.plan.dto';

@Controller('plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiOperation({ summary: 'plans 등록' })
  async createPaymentinfo(@Body() body: CreatePlanDto) {
    return await this.plansService.createPaymentinfo(body);
  }

  @Get()
  @ApiOperation({ summary: '전체 조회' })
  async getPlanInfoAll() {
    return await this.plansService.getPlanInfoAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '플랜 조회' })
  async getPlan(@Param('id', ValidateMongoIdPipe) planId: string) {
    return this.plansService.getPlan(planId);
  }
  @Patch(':id')
  @ApiOperation({ summary: '플랜 수정' })
  async updatePlan(@Param('id', ValidateMongoIdPipe) planId: string, @Body() body: UpdatePlanDto) {
    return this.plansService.updatePlan(planId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '플랜 삭제' })
  async deletePlan(@Param('id', ValidateMongoIdPipe) planId: string) {
    return this.plansService.deletePlan(planId);
  }
}
