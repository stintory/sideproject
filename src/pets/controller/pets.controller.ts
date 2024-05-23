import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PetsService } from '../service/pets.service';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../users/schema/user.schema';
import { CurrentUser } from '../../@decorator/user.decorator';
import { CreatePetDto } from '../dto/create.pet.dto';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdatePetDto } from '../dto/update.pet.dto';

@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'pet 등록' })
  async create(@CurrentUser() user: User, @Body() body: CreatePetDto) {
    const result = await this.petsService.create(user, body);
    return result;
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
  async updatePet(@Param('id', ValidateMongoIdPipe) petId: string, @Body() body: UpdatePetDto) {
    return await this.petsService.updatePet(petId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '정보 삭제' })
  async deletePet(@Param('id', ValidateMongoIdPipe) petId: string) {
    return await this.petsService.deletePet(petId);
  }
}
