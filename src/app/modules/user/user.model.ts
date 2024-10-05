/* eslint-disable @typescript-eslint/no-explicit-any */
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
    password: { type: String, default: 'change the password' },
    phone: {
      type: String,
      default: 'change the phone number',
    },
    address: {
      type: String,
      default: 'change the address',
    },
    role: {
      type: String,
      default: 'user',
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
  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.sault_rounds),
    );
    next();
  }
});

// set empty string password property
userSchema.post('save', function (doc: any, next) {
  // Convert the document to an object and remove the fields
  delete doc._doc.password;
  delete doc._doc.isDeleted;

  next();
});

// statics method to find out user exist or not
userSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await User.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
  return existingUser;
};

// statics method to compare the password
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User = model<TUser, TUserModel>('User', userSchema);
