import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'comments',
};

@Schema(options)
export class Comment extends Document {
  @Prop({
    required: true,
  })
  comment: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'users',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'posts',
    required: true,
  })
  postId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _CommentSchema = SchemaFactory.createForClass(Comment);
_CommentSchema.set('toObject', { virtuals: true });
_CommentSchema.set('toJSON', { virtuals: true });

export const CommentSchema = _CommentSchema;
