import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ImagesService } from '../service/images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageMulterOptions } from '../../@utils/multer.util';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { CreateImageDto } from '../dto/create.image.dto';

@Controller('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiOperation({ summary: '이미지 등록' })
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
        sex: { type: 'string', enum: ['MALE', 'FEMALE'] },
        birth: { type: 'string', format: 'date' },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10, imageMulterOptions))
  async createImage(
    @CurrentUser() user: User,
    @Body() body: CreateImageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const result = await this.imagesService.create(user, body, files);
  }
}
