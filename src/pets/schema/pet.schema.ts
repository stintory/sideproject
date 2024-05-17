import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'pets',
};

enum Sex {
  male = 'male',
  female = 'female',
}

@Schema(options)
export class Pet extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({
    enum: [Sex.male, Sex.female],
  })
  sex: Sex;

  @Prop()
  birth: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  age: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  UpdatedAt: Date;
}

const _PetSchema = SchemaFactory.createForClass(Pet);
_PetSchema.set('toObject', { virtuals: true });
_PetSchema.set('toJSON', { virtuals: true });

export const PetSchema = _PetSchema;
