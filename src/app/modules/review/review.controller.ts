import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { userId } = req.user;
  const reviewData = { ...payload, userId };
  const result = await ReviewServices.CreateReviewIntoDB(reviewData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReviewsForSingleBike = catchAsync(async (req: Request, res: Response) => {
  const {bikeId} = req.params;
  
  const result = await ReviewServices.getAllReviewForSingleBike(bikeId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});


export const ReviewControllers = {
  createReview,
  getAllReviewsForSingleBike
};
