/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { TUser, TUserModel } from './user.interface';
import { role } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, TUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: role,
        message: '{VALUE} is not a valid role',
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// hashing password before saving into DB
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.sault_rounds));
  next();
});

// set empty string password property
userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

// statics method
userSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await User.findById(id);
  return existingUser;
};

export const User = model<TUser, TUserModel>('User', userSchema);
