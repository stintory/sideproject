import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'posts',
};

type AuthorityType = {
  friends: {
    read: boolean;
    download: boolean;
  };
  family: {
    read: boolean;
    download: boolean;
  };
};

const defaultAuthority: AuthorityType = {
  friends: {
    read: false,
    download: false,
  },
  family: {
    read: false,
    download: false,
  },
};

// userId, title, images[], likes, comments, createdAtm updatedAt, authority.

@Schema(options)
export class Post extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    type: [Types.ObjectId],
    dafault: null,
    ref: 'images',
  })
  images: Types.ObjectId[];

  @Prop()
  likes: number;

  @Prop({
    types: [Types.ObjectId],
    default: null,
    ref: 'comments',
  })
  comments: Types.ObjectId[];

  @Prop({
    type: Object,
    default: defaultAuthority,
  })
  authority: AuthorityType;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  readonly getInfo: {
    id: string;
    title: string;
    content: string;
    likes: number;
    images: Types.ObjectId[];
    createdAt: string;
    updatedAt: string;
  };
}

const _PostSchema = SchemaFactory.createForClass(Post);

_PostSchema.virtual('getInfo').get(function (this: Post) {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    likes: this.likes,
    images: this.images,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

_PostSchema.set('toObject', { virtuals: true });
_PostSchema.set('toJSON', { virtuals: true });

export const PostSchema = _PostSchema;
