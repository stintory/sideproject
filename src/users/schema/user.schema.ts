import { Document, SchemaOptions, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const options: SchemaOptions = {
  versionKey: false,
  collection: 'users',
};

enum Role {
  admin = 'admin',
  user = 'user',
}

type MembersType = {
  user: MemberUserType;
};

type MemberUserType = {
  userId: string;
  role: string;
};

type friendType = {
  read: boolean;
  download: boolean;
};

type familyType = {
  read: boolean;
  download: boolean;
};

type AuthorityType = {
  friend: friendType;
  family: familyType;
};

@Schema(options)
export class User extends Document {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  provider: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  nickname: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  snsId: number;

  @Prop({
    required: true,
    enum: [Role.admin, Role.user],
    default: Role.user,
  })
  role: Role;

  @Prop({ default: null })
  members: MembersType[];

  @Prop({
    default: null,
  })
  email: string;

  @Prop({
    default: null,
  })
  phone: string;

  @Prop({
    default: false,
  })
  phoneVerified: boolean;

  @Prop({
    default: null,
  })
  authority: AuthorityType[];

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'plans',
  })
  planId: Types.ObjectId;

  @Prop()
  refreshToken: string[];

  @Prop()
  refreshTokenExpires: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  readonly readOnlyData: {
    _id: string;
    provider: string;
    nickname: string;
    role: string;
  };
}

const _UserSchema = SchemaFactory.createForClass(User);
_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    _id: this._id,
    provider: this.provider,
    nickname: this.nickname,
    role: this.role,
  };
});

export const UserSchema = _UserSchema;
