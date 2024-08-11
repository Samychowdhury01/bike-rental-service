/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from './user.model';

const getProfileFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
    // removing the isDeleted flag and password  from response
    const { isDeleted, password,...restData } = user.toObject();
  return restData;
};

export const UserServices = {
  getProfileFromDB,
};
