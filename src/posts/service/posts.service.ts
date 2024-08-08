import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { CreatePostsDto } from '../dto/create.posts.dto';
import { ImagesRepository } from '../../images/repository/images.repository';
import { PaginationOptions, PaginationResult } from '../../@interface/pagination.interface';
import { Post } from '../schema/posts.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getPaginate } from '../../@utils/pagination.utils';
import { CommentsRepository } from '../../comments/repository/comments.repository';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly imagesRepository: ImagesRepository,
    private readonly commentsRepository: CommentsRepository,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(user, body: CreatePostsDto, files: Express.Multer.File[]) {
    try {
      const { title, content, growthReport } = body;
      const userId = user._id;
      const growthReportFlag = growthReport ?? false;

      const newPostData: any = {
        title,
        content,
        userId,
      };

      const newPost = await this.postsRepository.create(newPostData);

      let imageIds: string[] = [];

      if (files && files.length > 0) {
        const processedFiles = files.map((file) => {
          file.filename = `${Date.now()}_${file.originalname}`;
          return file;
        });

        imageIds = await Promise.all(
          processedFiles.map((file) => this.uploadImage(file, growthReportFlag, newPost._id, userId)),
        );
      }

      if (imageIds.length > 0) {
        await this.postsRepository.findByIdAndUpdate(newPost._id, { images: imageIds });
      }

      const resultUpdated = await this.postsRepository.findById(newPost._id);
      const result = resultUpdated.getInfo;

      return { result };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async uploadImage(image: Express.Multer.File, growthReport: boolean, postId, userId) {
    const { filename, mimetype } = image;

    const uploadedImage = await this.imagesRepository.uploadImage({
      filename,
      type: mimetype,
      growthReport,
      postId,
      userId,
    });
    if (!uploadedImage) {
      throw new BadRequestException('이미지 업로드에 실패하였습니다.');
    }

    return uploadedImage._id;
  }

  async findAll(user, paginationOptions: PaginationOptions): Promise<PaginationResult<Post>> {
    const userId = new Types.ObjectId(user._id);
    const condition = { userId };

    const { data, totalResults } = await getPaginate<Post>(this.postModel, condition, paginationOptions, {});
    const result: any = await Promise.all(data.map(async (post) => post.getInfo));

    return {
      data: result,
      meta: {
        page: paginationOptions.page,
        size: paginationOptions.limit,
        total: totalResults,
      },
    };
  }

  async getPost(postId: string) {
    try {
      const findPost = await this.postsRepository.findById(postId);
      if (!findPost) {
        throw new BadRequestException('존재하지 않는 게시글입니다.');
      }

      const result = {
        id: findPost._id,
        title: findPost.title,
        content: findPost.content,
        likes: findPost.likes,
        images: findPost.images,
        comments: findPost.comments,
        authority: findPost.authority,
        userId: findPost.userId,
        createdAt: findPost.createdAt,
        updatedAt: findPost.updatedAt,
      };

      return { result, message: 'Post found success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePost(postId: string, body) {
    try {
      const { title, content } = body;
      const findPost = await this.postsRepository.findById(postId);
      if (!findPost) {
        throw new BadRequestException('Not exist Post');
      }
      const updatedAt = new Date(Date.now());

      const updatePost = await this.postsRepository.findByIdAndUpdate(postId, { title, content, updatedAt });

      return {
        result: {
          ...updatePost.getInfo,
        },
        message: 'Post updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deletePost(postId: string) {
    try {
      await this.postsRepository.deleteById(postId);
      return { message: 'Post deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
