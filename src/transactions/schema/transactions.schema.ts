import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'transactions',
};

@Schema(options)
export class Transaction extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'plans',
  })
  planId: Types.ObjectId;

  @Prop()
  amount: number; // 결제금액.

  @Prop()
  currency: string; // enum [KRW, USD]

  @Prop({ default: null })
  pgProvider: string;

  @Prop({ default: null })
  pgId: string;

  @Prop({ default: null })
  impUid: string;

  @Prop({ default: null })
  buyerEmail: string;

  @Prop({ default: null })
  buyerName: string;

  @Prop({ default: null })
  buyerTel: string;

  @Prop({ default: null })
  buyerCompany: string;

  @Prop({ default: null })
  receiptUrl: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const _TransactionSchema = SchemaFactory.createForClass(Transaction);

_TransactionSchema.methods.toWeb = function () {
  const json = this.toJSON();
  json.id = this._id;
  return json;
};

export const TransactionSchema = _TransactionSchema;
