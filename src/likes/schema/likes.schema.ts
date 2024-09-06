import { Document, SchemaOptions, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'likes',
};

@Schema(options)
export class Like extends Document {
  @Prop({
    types: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'posts',
  })
  postId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'comments',
  })
  commentId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const _LikeSchema = SchemaFactory.createForClass(Like);
export const LikeSchema = _LikeSchema;
