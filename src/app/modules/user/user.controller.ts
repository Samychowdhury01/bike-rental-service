import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { UserServices } from './user.service';

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await UserServices.getProfileFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile retrieved successfully',
    data: result,
  });
});
const getDashboardData = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await UserServices.dashBoardDataFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User data retrieved successfully',
    data: result,
  });
});
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;
  const result = await UserServices.updateProfileIntoDB(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated  successfully',
    data: result,
  });
});
const promoteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.promoteUserIntoDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Promoted successfully',
    data: result,
  });
});
const removeUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.removeUserFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'user removed successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'users retrieved successfully',
    data: result,
  });
});

export const UserControllers = {
  getProfile,
  updateProfile,
  promoteUser,
  removeUser,
  getAllUsers,
  getDashboardData,
};
