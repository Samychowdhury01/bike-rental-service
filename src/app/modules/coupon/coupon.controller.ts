import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { CouponServices } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await CouponServices.createCouponIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon created successfully',
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponServices.getAllCouponsFroDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupons retrieved successfully',
    data: result,
  });
});

const removeCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponServices.deleteCouponFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

export const CouponControllers = {
  createCoupon,
  getAllCoupons,
  removeCoupon,
};
