/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
// get profile data of the user
const getProfileFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  // removing the isDeleted flag and password  from response
  const { isDeleted, password, ...restData } = user.toObject();
  return restData;
};

// update profile data of the user
const updateProfileIntoDB = async (id: string, payload: Partial<TUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  // check if it's deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
  }
  // hashing the pass if provided
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload?.password,
      Number(config.sault_rounds),
    );
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    projection: {
      isDeleted: 0,
      password: 0,
    },
  });
  return result;
};
export const UserServices = {
  getProfileFromDB,
  updateProfileIntoDB,
};
