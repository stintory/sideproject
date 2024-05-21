import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { CreatePostsDto } from '../dto/create.posts.dto';
import { ImagesRepository } from '../../images/repository/images.repository';
import { v4 } from 'uuid';
import * as fs from 'fs';
import { PaginationOptions, PaginationResult } from '../../@interface/pagination.interface';
import { Post } from '../schema/posts.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getPaginate } from '../../@utils/pagination.utils';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly imagesRepository: ImagesRepository,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(user, body: CreatePostsDto, files: Express.Multer.File[]) {
    try {
      const { title, content } = body;
      const userId = user._id;

      let imageIds: string[] = [];

      if (files) {
        for (let i = 0, len = files.length; i < len; i++) {
          const hash = v4().replace(/-/g, '').slice(0, 24);
          files[i].filename = `${Date.now()}_${hash}_${files[i].originalname}`;
        }
        imageIds = await Promise.all(files.map((image) => this.uploadImage(image)));
      }
      const newPostData: any = {
        title,
        content,
        userId,
      };

      if (imageIds.length > 0) {
        newPostData.images = imageIds;
      }

      const newPost = await this.postsRepository.create(newPostData);
      const result = newPost.getInfo;
      return { result };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async uploadImage(image: any) {
    const { originalname, mimetype } = image;
    const name = originalname;
    const type = mimetype;

    const uploadedImage = await this.imagesRepository.uploadImage({ name, type });
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
        throw new BadRequestException('존재하지 않는 게시글입니다.');
      }
      const updatedAt = new Date(Date.now());

      const updatePost = await this.postsRepository.updateById(postId, { title, content, updatedAt });

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
