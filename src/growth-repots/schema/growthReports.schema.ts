import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'growReports',
};

@Schema(options)
export class GrowReport extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({ defualt: null })
  day: Date;

  @Prop({
    required: true,
  })
  title: string;

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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _GrowReportSchema = SchemaFactory.createForClass(GrowReport);
_GrowReportSchema.set('toObject', { virtuals: true });
_GrowReportSchema.set('toJSON', { virtuals: true });

export const GrowReportSchema = _GrowReportSchema;
