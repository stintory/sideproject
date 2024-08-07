import { Document, SchemaOptions } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'images',
};

@Schema(options)
export class Image extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    default: false,
  })
  growthReport: boolean;

  @Prop({
    required: false,
  })
  src: string;

  @Prop({
    required: false,
  })
  type: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _ImageSchema = SchemaFactory.createForClass(Image);
_ImageSchema.set('toObject', { virtuals: true });
_ImageSchema.set('toJSON', { virtuals: true });

export const ImageSchema = _ImageSchema;
