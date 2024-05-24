import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiaryService } from '../service/diary.service';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { CreateDiaryDto } from '../dto/create.diary.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diaryMulterOptions } from '../../@utils/multer.util';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdateDiaryDto } from '../dto/update.diary.dto';

@Controller('diary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image', 5, diaryMulterOptions))
  @ApiOperation({ summary: '다이어리 생성' })
  async createDiary(
    @CurrentUser() user: User,
    @Body() body: CreateDiaryDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    // 1. 다이어리 생성
    // 2. 이미지는 5장까지만 업로드 가능.
    // 3. 이미지는 s3에 저장 하며 mongo에는 이미지 타입과 타이틀 이름, ObjectId를 저장 한다.

    const result = await this.diaryService.createDiary(user, body, files);
    return result;
  }

  @Get()
  @ApiOperation({ summary: '전체 조회' })
  async findAllDiary(@CurrentUser() user: User) {
    return await this.diaryService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: '단건 조회' })
  async getDiary(@Param('id', ValidateMongoIdPipe) diaryId: string) {
    return this.diaryService.getDiary(diaryId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '수정' })
  async updateDiary(@Param('id', ValidateMongoIdPipe) diaryId: string, @Body() body: UpdateDiaryDto) {
    return this.diaryService.updateDiary(diaryId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '삭제' })
  async deleteDiary(@Param('id', ValidateMongoIdPipe) diaryId: string) {
    return this.diaryService.deleteDiary(diaryId);
  }
}
