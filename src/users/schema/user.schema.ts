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
  socialLogin: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  nickname: string;

  @Prop({
    default: null,
  })
  sex: string;

  @Prop({
    required: true,
    enum: [Role.admin, Role.user],
    default: Role.user,
  })
  role: Role;

  @Prop({ default: [] })
  members: MembersType;

  @Prop({
    default: null,
  })
  email: string;

  @Prop({
    default: null,
  })
  name: string;

  @Prop({
    default: null,
  })
  phone: string;

  @Prop({
    default: null,
  })
  birth: string;

  @Prop({
    default: false,
  })
  phoneVerified: boolean;

  @Prop({
    defualt: [],
  })
  authority: AuthorityType;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'plans',
  })
  planId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  readonly readonlyData: {
    _id: string;
    socialLogin: string;
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
    socialLogin: this.socialLogin,
    nickname: this.nickname,
    role: this.role,
  };
});

export const UserSChema = _UserSchema;
