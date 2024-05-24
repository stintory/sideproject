import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'diary',
};

@Schema(options)
export class Diary extends Document {
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

  @Prop({ required: true })
  day: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'images',
  })
  images: Types.ObjectId;

  @Prop({
    default: false,
  })
  lifeEvent: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _DiarySchema = SchemaFactory.createForClass(Diary);
_DiarySchema.set('toObject', { virtuals: true });
_DiarySchema.set('toJSON', { virtuals: true });

export const DiarySchema = _DiarySchema;
