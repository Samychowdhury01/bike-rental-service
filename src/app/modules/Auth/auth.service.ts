import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const createUserIntoDB = async (payload: TUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  const result = await User.create(payload);
  return result;
};

// login user using email and password
const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });

  // check user exist or not
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }
  const isDeleted = user.isDeleted;

  // check existing user is deleted
  if (isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User is deleted');
  }

  // matching the password
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );
  // if password does match throw error
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  // jwt payload data
  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };
  // signing a accessToken
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    user
  };
};

export const AuthServices = {
  createUserIntoDB,
  loginUser,
};
