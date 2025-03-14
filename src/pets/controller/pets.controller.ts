import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PetsService } from '../service/pets.service';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../users/schema/user.schema';
import { CurrentUser } from '../../@decorator/user.decorator';
import { CreatePetDto } from '../dto/create.pet.dto';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdatePetDto } from '../dto/update.pet.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { petMulterOptions, postMulterOptions } from '../../@utils/multer.util';

@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'pet 등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' },
        age: { type: 'number' },
        gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
        birth: { type: 'string', format: 'date' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', petMulterOptions))
  async create(@CurrentUser() user: User, @Body() body: CreatePetDto, @UploadedFile() file?: Express.Multer.File) {
    console.log(file);
    const result = await this.petsService.create(user, body, file);
    return { result };
  }

  @Get()
  @ApiOperation({ summary: '전체 조회' })
  async findAll(@CurrentUser() user: User) {
    return await this.petsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: '단건 조회' })
  async findOne(@Param('id', ValidateMongoIdPipe) petId: string) {
    return await this.petsService.findOne(petId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '정보 수정' })
  @ApiBody({
    description: 'Pet Image and Info Update',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        sex: { type: 'string', enum: ['MALE', 'FEMALE'] },
        birth: { type: 'string', format: 'date' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updatePet(@Param('id', ValidateMongoIdPipe) petId: string, @Body() body: UpdatePetDto) {
    // TODO: UpdatePetDto 사진 수정 추가.
    return await this.petsService.updatePet(petId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '정보 삭제' })
  async deletePet(@Param('id', ValidateMongoIdPipe) petId: string) {
    return await this.petsService.deletePet(petId);
  }
}
