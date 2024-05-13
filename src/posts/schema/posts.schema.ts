import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'posts',
};

type friendType = {
  read: boolean;
  download: boolean;
};

type familyType = {
  read: boolean;
  download: boolean;
};

type AuthorityType = {
  friend: friendType;
  family: familyType;
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
    type: [Types.ObjectId],
    required: false,
    ref: 'images',
  })
  images: Types.ObjectId[];

  @Prop({
    defualt: 0,
  })
  likes: number;

  @Prop({
    types: Object,
    required: false,
    ref: 'comments',
  })
  comments: Types.ObjectId;

  @Prop({
    required: false,
  })
  authority: AuthorityType;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _PostsSchema = SchemaFactory.createForClass(Post);
_PostsSchema.set('toObject', { virtuals: true });
_PostsSchema.set('toJSON', { virtuals: true });

export const PostsSchema = _PostsSchema;
