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
import { PostsService } from '../service/posts.service';
import { JwtAuthGuard } from '../../auth/strategies/jwt/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostsDto } from '../dto/create.posts.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { postMulterOptions } from '../../@utils/multer.util';
import { CurrentUser } from '../../@decorator/user.decorator';
import { User } from '../../users/schema/user.schema';
import { PaginationDecorator } from '../../@decorator/pagination/pagination.decorator';
import { PaginationOptions } from '../../@interface/pagination.interface';
import { ValidateMongoIdPipe } from '../../@common/pipes/ValidateMongoIdPipe';
import * as Path from 'path';
import { UpdatePostsDto } from '../dto/update.posts.dto';
import { CommentsService } from '../../comments/service/comments.service';
import { CreateCommentDto } from '../../comments/dto/create.comment.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '게시글 생성' })
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
        title: { type: 'string' },
        content: { type: 'string' },
        comments: { type: 'string' },
      },
      required: ['title', 'content'],
    },
  })
  @UseInterceptors(FilesInterceptor('image', 30, postMulterOptions))
  async create(
    @CurrentUser() user: User,
    @Body() body: CreatePostsDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const result = await this.postsService.create(user, body, files);
    return result;
  }

  @Get()
  @ApiOperation({ summary: '게시글 전체 조회' })
  async getAllPosts(@CurrentUser() user: User, @PaginationDecorator() pagination: PaginationOptions) {
    return this.postsService.findAll(user, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 단건 조회' })
  async getPost(@Param('id', ValidateMongoIdPipe) postId: string) {
    return this.postsService.getPost(postId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '게시글 수정' })
  async updatePost(@Param('id', ValidateMongoIdPipe) postId: string, @Body() body: UpdatePostsDto) {
    return this.postsService.updatePost(postId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제' })
  async deletePost(@Param('id', ValidateMongoIdPipe) postId: string) {
    return this.postsService.deletePost(postId);
  }

  // ===================================================
  // 댓글 생성
  @Post(':id/comment')
  @ApiOperation({ summary: '댓글 생성' })
  async createComment(
    @Param('id', ValidateMongoIdPipe) postId: string,
    @CurrentUser() user: User,
    @Body() body: CreateCommentDto,
  ) {
    return this.postsService.createComment(postId, user, body);
  }

  //TODO: 게시글 좋아요 및 좋아요

  //TODO: 게시글 좋아요 취소.
}
