import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/Auth/auth.interface';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import sendResponse from '../utils/sendResponse';

const auth = (...requireRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // if token is not given or "Bearer" is missing throwing an error
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
    const token = authHeader.split(' ')[1];
    // validating the token
    const decoded = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    );
    // if token is invalid or expired throwing an error
    if (!decoded) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
    const { userId, role } = decoded as JwtPayload;

    // check if the user is deleted or not
    const user = await User.isUserExist(userId);
    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'You have no access to this route',
      });
    }
    if (requireRoles && !requireRoles.includes(role)) {
      return sendResponse(res, {
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
