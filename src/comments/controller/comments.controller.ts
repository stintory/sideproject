import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../service/comments.service';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { PaginationDecorator } from '../../@decorator/pagination/pagination.decorator';
import { PaginationOptions } from '../../@interface/pagination.interface';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdateCommentDto } from '../dto/update.comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: '댓글 전체 조회' })
  async getAllComments(@CurrentUser() user: User, @PaginationDecorator() pagination: PaginationOptions) {
    return this.commentsService.findAll(user, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '댓글 단건 조회' })
  async getComment(@Param('id', ValidateMongoIdPipe) commentId: string) {
    return this.commentsService.getComment(commentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글 수정' })
  async updateComment(@Param('id', ValidateMongoIdPipe) commentId: string, @Body() body: UpdateCommentDto) {
    return this.commentsService.updateComment(commentId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제' })
  async deleteComment(@Param('id', ValidateMongoIdPipe) commentId: string) {
    return this.commentsService.deleteComment(commentId);
  }
}
