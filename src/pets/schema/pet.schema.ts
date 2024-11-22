import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'pets',
};

@Schema(options)
export class Pet extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  image: string;

  @Prop()
  age: number;

  @Prop({
    required: true,
  })
  gender: string;

  @Prop()
  birth: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  updatedAt: Date;

  readonly petInfo: {
    id: string;
    name: string;
  };
}

const _PetSchema = SchemaFactory.createForClass(Pet);
_PetSchema.set('toObject', { virtuals: true });
_PetSchema.set('toJSON', { virtuals: true });
// _PetSchema.virtual('petInfo').get(function (this: Pet) {
//   return {
//     id: this.id,
//     name: this.name,
//   };
// });

export const PetSchema = _PetSchema;
