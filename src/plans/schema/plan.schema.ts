import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { IsObject } from 'class-validator';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'plans',
};

@Schema(options)
export class Plan extends Document {
  @Prop()
  name: string; // free, basic, premium

  @Prop({
    type: Object,
    default: {
      KRW: 0,
      USD: 0,
    },
  })
  price: Record<string, number>;

  @Prop()
  tax: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const _PlanSchema = SchemaFactory.createForClass(Plan);
_PlanSchema.methods.toWeb = function () {
    const json = this.toJSON();
    json.id = this._id;
    return json;
}

export const PlanSchema = _PlanSchema;
