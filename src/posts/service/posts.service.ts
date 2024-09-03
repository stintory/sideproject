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
      const { title, content, growthReport, authority } = body;
      console.log(title, content, growthReport, authority);
      const userId = user._id;
      const growthReportFlag = growthReport ?? false;
      const newAuthority = authority ?? 'none';

      const newPostData: any = {
        title,
        content,
        userId,
        growthReport: growthReportFlag,
        authority: newAuthority,
      };

      const newPost = await this.postsRepository.create(newPostData);

      let imagesData: { _id: Types.ObjectId; src: string }[] = [];

      if (files && files.length > 0) {
        imagesData = await Promise.all(files.map((file) => this.uploadImage(file, growthReportFlag, userId)));
      }

      if (imagesData.length > 0) {
        await this.postsRepository.findByIdAndUpdate(newPost._id, { images: imagesData });
      }

      const resultUpdated = await this.postsRepository.findByIdWithImage({ _id: newPost._id });
      console.log(resultUpdated);
      const result = resultUpdated.getInfo;
      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async uploadImage(image: Express.Multer.File, growthReport: boolean, userId) {
    const { filename, mimetype, path } = image;

    const uploadedImage = await this.imagesRepository.uploadImage({
      filename,
      type: mimetype,
      src: path,
      growthReport,
      userId,
    });
    if (!uploadedImage) {
      throw new BadRequestException('이미지 업로드에 실패하였습니다.');
    }

    return { _id: uploadedImage._id, src: uploadedImage.src };
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
      const findPost = await this.postsRepository.findByIdComments(postId);
      if (!findPost) {
        throw new BadRequestException('존재하지 않는 게시글입니다.');
      }

      const result = {
        id: findPost._id,
        title: findPost.title,
        content: findPost.content,
        likes: findPost.likes,
        images: findPost.images,
        comments: findPost.comments.map((comment: any) => ({
          _id: comment._id,
          userId: comment.userId,
          comment: comment.comment,
        })),
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
      const { title, content, authority } = body;
      const findPost = await this.postsRepository.findById(postId);
      if (!findPost) {
        throw new BadRequestException('Not exist Post');
      }
      const updatedAt = new Date(Date.now());

      const updatePost = await this.postsRepository.findByIdAndUpdate(postId, { title, content, authority, updatedAt });

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
      // TODO: 해당 포스트를 삭제하면 관련된 이미지도 같이 삭제.
      await this.postsRepository.deleteById(postId);
      return { message: 'Post deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
