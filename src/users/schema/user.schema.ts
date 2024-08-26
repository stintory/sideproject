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

type Authority = 'friend' | 'family' | 'none';

type SubscriptionType = {
  lastPayment: Date;
  nextPayment: Date;
  pgProvider?: string;
  customerUid?: string;
  merchantUid?: string;
  enabled?: boolean;
};

@Schema(options)
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  provider: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  nickname: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  gender: string;

  @Prop({
    required: true,
  })
  birth: string;

  @Prop()
  snsId: string;

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
  phone: string;

  @Prop({
    default: false,
  })
  phoneVerified: boolean;

  @Prop({
    enum: ['friend', 'family', 'none'],
    default: 'none',
  })
  authority: Authority;

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'plans',
  })
  planId: Types.ObjectId;

  @Prop({
    default: false,
  })
  isSub: boolean; // plan을 구독중인지 확인.

  @Prop()
  refreshToken: string;

  @Prop()
  refreshTokenExpires: Date;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({
    type: {
      lastPayment: { type: Date, default: null, required: false },
      nextPayment: { type: Date, default: null, required: false },
      pgProvider: { type: String, enum: [null, 'paypal_v2', 'inicis'], default: null },
      customerUid: { type: String, default: null },
      merchantUid: { type: String, default: null },
      enabled: { type: Boolean, default: true },
    },
    default: () => ({}),
  })
  subscription: SubscriptionType;

  readonly readOnlyData: {
    _id: string;
    email: string;
    nickname: string;
    role: string;
    isSub: boolean;
  };

  readonly updateUser: {
    _id: string;
    email: string;
    nickname: string;
    sex: string;
    name: string;
    birth: string;
    phone: string;
    phoneVerified: boolean;
  };

  readonly getMe: {
    _id: string;
    email: string;
    nickname: string;
    name: string;
    phone: string;
    phoneVerified: boolean;
    gender: string;
    birth: string;
    role: string;
    isSub: boolean;
  };

  readonly subscriptionInfo: {
    subscription: SubscriptionType;
  };
}

const _UserSchema = SchemaFactory.createForClass(User);
_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    _id: this._id,
    email: this.email,
    nickname: this.nickname,
    role: this.role,
    isSub: this.isSub,
  };
});

_UserSchema.virtual('updateUser').get(function (this: User) {
  return {
    _id: this._id,
    email: this.email,
    nickname: this.nickname,
    gender: this.gender,
    name: this.name,
    birth: this.birth,
    phone: this.phone,
    phoneVerified: this.phoneVerified,
  };
});

_UserSchema.virtual('getMe').get(function (this: User) {
  return {
    _id: this._id,
    email: this.email,
    nickname: this.nickname,
    name: this.name,
    phone: this.phone,
    phoneVerified: this.phoneVerified,
    gender: this.gender,
    birth: this.birth,
    role: this.role,
    isSub: this.isSub,
  };
});

_UserSchema.virtual('subscriptionInfo').get(function (this: User) {
  return {
    lasPayment: this.subscription.lastPayment,
    nextPayment: this.subscription.nextPayment,
    pgProvider: this.subscription.pgProvider,
    customerUid: this.subscription.customerUid,
    merchantUid: this.subscription.merchantUid,
    enabled: this.subscription.enabled,
  };
});

export const UserSchema = _UserSchema;
