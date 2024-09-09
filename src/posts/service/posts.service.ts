import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { CreatePostsDto } from '../dto/create.posts.dto';
import { ImagesRepository } from '../../images/repository/images.repository';
import { PaginationOptions, PaginationResult } from '../../@interface/pagination.interface';
import { Post } from '../schema/posts.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getPaginate } from '../../@utils/pagination.utils';
import { CommentsRepository } from '../../comments/repository/comments.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { LikesRepository } from '../../likes/repository/likes.repository';
import { User } from '../../users/schema/user.schema';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly imagesRepository: ImagesRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly likesRepository: LikesRepository,
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

  async findAll(user, paginationOptions: PaginationOptions, authority: string): Promise<PaginationResult<Post>> {
    const userId = new Types.ObjectId(user._id);
    let condition: FilterQuery<Post>;

    console.log(user._id);
    // 사용자의 관계를 데이터베이스에서 조회합니다.
    const userRelations = await this.usersRepository.findByIdRelation(user._id);
    // console.log(userRelations);

    // 사용자와 관계가 있는 유저들의 ID를 배열로 추출합니다.
    const userRelationIds = userRelations.members.map((member) => member.userId);
    console.log(userRelationIds);

    if (authority === 'none') {
      // 'none' 권한의 게시글을 가져옵니다.
      condition = {
        $or: [
          { userId }, // 사용자가 작성한 게시글
          { authority: 'none', userId: { $ne: userId } }, // 다른 사용자가 작성한 'none' 권한의 게시글
        ],
      };
    } else if (authority === 'friend') {
      // 'friend' 권한의 게시글을 가져옵니다.
      condition = {
        $or: [
          { userId: { $in: userRelationIds }, authority: 'friend' }, // 친구인 유저가 작성한 게시글
          { userId, authority: 'friend' }, // 사용자가 작성한 'friend' 권한의 게시글
        ],
      };
    } else if (authority === 'family') {
      // 'family' 권한의 게시글을 가져옵니다.
      condition = {
        $or: [
          { userId: { $in: userRelationIds }, authority: 'family' }, // 가족인 유저가 작성한 게시글
          { userId, authority: 'family' }, // 사용자가 작성한 'family' 권한의 게시글
        ],
      };
    } else {
      // 기본적으로 사용자가 작성한 게시글만 가져옵니다.
      condition = { userId };
    }
    // 필터 조건에 맞는 게시글을 페이징 처리하여 조회합니다.
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
        throw new BadRequestException('Not exist Post');
      }
      const commentsWithDetails = await Promise.all(
        findPost.comments.map(async (commentId: Types.ObjectId) => {
          // 댓글 정보 조회
          const comment = await this.commentsRepository.findById(commentId);
          if (comment) {
            // 댓글의 userId로 유저 정보 조회
            const user = await this.usersRepository.findByIdInPost(comment.userId);

            // 유저 닉네임 추가
            return {
              _id: comment._id,
              userId: comment.userId,
              nickname: user?.nickname || 'Unknown', // 유저 닉네임이 없으면 'Unknown'으로 처리
              comment: comment.comment,
              createdAt: comment.createdAt,
            };
          } else {
            return null; // 댓글이 없을 경우 null 처리
          }
        }),
      );

      const filteredComments = commentsWithDetails.filter((comment) => comment !== null);

      const result = {
        id: findPost._id,
        title: findPost.title,
        content: findPost.content,
        likes: findPost.likes,
        images: findPost.images,
        comments: filteredComments, // 조회한 댓글 리스트 (닉네임 포함)
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

  async getBookmarkList(user: User) {
    const userId = new Types.ObjectId(user._id);
    console.log(userId);
    const isBookmark = true;
    const result = await this.postsRepository.findByIdWithBookmark(userId, isBookmark);

    if (result.length === 0) {
      return { message: 'none' };
    }
    return { result };
  }

  async updatePost(postId: string, body) {
    try {
      const { title, content, authority, isBookmark } = body;
      const findPost = await this.postsRepository.findById(postId);
      if (!findPost) {
        throw new BadRequestException('Not exist Post');
      }
      const updatedAt = new Date(Date.now());

      const updatePost = await this.postsRepository.findByIdAndUpdate(postId, {
        title,
        content,
        authority,
        isBookmark,
        updatedAt,
      });

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

  async toggleLike(userId: string, postId: string) {
    try {
      const post = await this.postsRepository.findById(postId);
      if (!post) {
        throw new BadRequestException('Not exist Post');
      }

      // 좋아요 여부 확인 (LikeSchema에서 조회)
      const existingLike = await this.likesRepository.findOne({ userId, postId });

      if (existingLike) {
        // 좋아요가 이미 존재 하면 좋아요 취소
        await this.likesRepository.deleteOne({ userId, postId });
        post.likes -= 1;
      } else {
        // 좋아요 추가
        await this.likesRepository.create({ userId, postId });
        post.likes += 1;
      }

      await post.save();

      return {
        message: existingLike ? '좋아요 취소됨.' : '좋아요 추가됨.',
        likes: post.likes,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async totalLike(postId: string) {
    try {
      const totalLikes = await this.likesRepository.count({ postId });

      return { likes: totalLikes };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
