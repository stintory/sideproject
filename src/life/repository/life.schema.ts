import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'lifeCycle',
};

@Schema(options)
export class LifeCycle extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'images',
  })
  imagesId: Types.ObjectId;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({ default: '' })
  day: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _LifeCycleSchema = SchemaFactory.createForClass(LifeCycle);
_LifeCycleSchema.set('toObject', { virtuals: true });
_LifeCycleSchema.set('toJSON', { virtuals: true });

export const LifeCycleSchema = _LifeCycleSchema;
