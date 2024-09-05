import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'history',
};

@Schema(options)
export class History extends Document {
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
    default: Date.now,
  })
  createdAt: Date;
}

const _HistorySchema = SchemaFactory.createForClass(History);
_HistorySchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});
_HistorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

export const HistorySchema = _HistorySchema;
