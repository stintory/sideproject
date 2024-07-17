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
    index: true,
    unique: true,
    default: null,
  })
  provider: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  nickname: string;

  @Prop({
    index: true,
    unique: true,
    default: null,
  })
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
  email: string;

  @Prop()
  password: string;

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
    provider: string;
    nickname: string;
    role: string;
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
    provider: this.provider,
    nickname: this.nickname,
    role: this.role,
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
