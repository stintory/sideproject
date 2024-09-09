import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('likes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('/check')
  async checkLike(
    @CurrentUser() user: User,
    @Query('postId', ValidateMongoIdPipe) postId?: string,
    @Query('commentId', ValidateMongoIdPipe) commentId?: string,
  ) {
    return await this.likesService.checkLike(user, postId, commentId);
  }
}
