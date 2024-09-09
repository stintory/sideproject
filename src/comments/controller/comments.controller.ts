import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../service/comments.service';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { PaginationDecorator } from '../../@decorator/pagination/pagination.decorator';
import { PaginationOptions } from '../../@interface/pagination.interface';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import { UpdateCommentDto } from '../dto/update.comment.dto';
import { CreateCommentDto } from '../dto/create.comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  async createComment(@CurrentUser() user: User, @Query('postId') postId: string, @Body() body: CreateCommentDto) {
    return this.commentsService.createComment(user, postId, body);
  }

  @Get()
  @ApiOperation({ summary: '댓글 전체 조회' })
  async getAllComments(@CurrentUser() user: User, @PaginationDecorator() pagination: PaginationOptions) {
    return this.commentsService.findAll(user, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '댓글 단건 조회' })
  async getComment(@CurrentUser() user: User, @Param('id', ValidateMongoIdPipe) commentId: string) {
    return this.commentsService.getComment(user, commentId);
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

  @Patch('/likes/:id')
  @ApiOperation({ summary: '댓글 좋아요' })
  async toggleLike(@CurrentUser() user: User, @Param('id', ValidateMongoIdPipe) id: string) {
    return this.commentsService.toggleLike(user._id, id);
  }

  @Get('/likes/:id')
  @ApiOperation({ summary: '댓글 좋아요 총개수' })
  async isLiked(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.commentsService.totalLike(id);
  }
}
