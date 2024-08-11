import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/Auth/auth.interface';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import authErrorResponse from '../utils/authErrorResponse';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

const auth = async (...requireRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if token is not given throwing an error
    if (!token) {
      return authErrorResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'UNAUTHORIZED',
      });
    }

    // validating the token
    const decoded = jwt.verify(token, config.jwt_access_secret as string);

    // if token is invalid or expired throwing an error
    if (!decoded) {
      return authErrorResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'UNAUTHORIZED',
      });
    }
    const { userId, role } = decoded as JwtPayload;

    // check if the user is deleted or not
    const user = await User.isUserExist(userId);
    if (!user) {
      return authErrorResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'You have no access to this route',
      });
    }
    if (requireRoles && !requireRoles.includes(role)) {
      return authErrorResponse(res, {
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: 'You have no access to this route',
      });
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
