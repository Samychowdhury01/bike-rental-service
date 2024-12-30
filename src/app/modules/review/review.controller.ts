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

const getAllReviewsForSingleBike = catchAsync(
  async (req: Request, res: Response) => {
    const { bikeId } = req.params;

    const result = await ReviewServices.getAllReviewForSingleBike(bikeId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Review retrieved successfully',
      data: result,
    });
  },
);

const getUserReviews = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const query = req.query;

  const result = await ReviewServices.getUserReviewsFromDB(userId, query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User reviews retrieved successfully',
    data: result.reviews,
    meta: result.meta,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviewsFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All views retrieved successfully',
    data: result.reviews,
    meta: result.meta,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviewsForSingleBike,
  getUserReviews,
  getAllReviews,
};
