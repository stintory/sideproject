import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Image } from '../../images/schema/images.schema';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'posts',
};

type Authority = 'friend' | 'family' | 'none';

@Schema(options)
export class Post extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Users',
    default: null,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  nickname: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  content: string;

  // @Prop({ type: [{ type: Types.ObjectId, required: true, ref: 'Image' }] })
  // images: Types.ObjectId[];

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, ref: 'Image', required: true },
        src: { type: String, required: true },
      },
    ],
    default: [],
  })
  images: { _id: Types.ObjectId; src: string }[];

  @Prop({
    default: 0,
  })
  likes: number;

  @Prop({ default: false })
  growthReport: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments: Types.ObjectId[];

  @Prop({
    enum: ['friend', 'family', 'none'],
    default: 'none',
  })
  authority: Authority;

  @Prop({
    default: false,
  })
  isBookmark: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  readonly getInfo: {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    content: string;
    comments: Types.ObjectId[];
    likes: number;
    growthReport: boolean;
    authority: Authority;
    images: { _id: Types.ObjectId; src: string }[];
    createdAt: string;
    updatedAt: string;
  };
}

const _PostSchema = SchemaFactory.createForClass(Post);

_PostSchema.virtual('getInfo').get(function (this: Post) {
  return {
    id: this._id,
    userId: this.userId,
    title: this.title,
    content: this.content,
    comments: this.comments,
    likes: this.likes,
    growthReport: this.growthReport,
    authority: this.authority,
    images: this.images.map((image) => ({
      _id: image._id,
      src: image.src,
    })),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

_PostSchema.set('toObject', { virtuals: false });
_PostSchema.set('toJSON', { virtuals: true });

export const PostSchema = _PostSchema;
