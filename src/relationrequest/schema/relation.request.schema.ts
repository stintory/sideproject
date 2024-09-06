import { SchemaOptions, Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'relationrequest',
};

@Schema(options)
export class RelationRequest extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  requesterId: Types.ObjectId; // 신청하는 사람.

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  recipientId: Types.ObjectId; // 수신하는 사람.

  @Prop({
    type: String,
    enum: ['friend', 'family', 'ban'],
    required: true,
  })
  type: string;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    required: true,
    default: 'pending',
  })
  status: string; // 신청 상태.
}

const _RelationRequestSchema = SchemaFactory.createForClass(RelationRequest);
export const RelationRequestSchema = _RelationRequestSchema;
