import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TReview } from './review.interface';
import Review from './review.model';
import { Bike } from '../bike/bike.model';
import { User } from '../user/user.model';

const CreateReviewIntoDB = async (payload: Partial<TReview>) => {
  const user = await User.findById({
    _id: payload.userId,
  });
  const review = { ...payload, userName: user?.name };
  const result = await Review.create(review);
  return result;
};

const getAllReviewForSingleBike = async (bikeId: string) => {
  const reviews = await Review.find({
    bikeId,
  }).sort({
    createdAt: -1,
  });
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;
  return {
    reviews,
    averageRating,
  };
};
export const ReviewServices = {
  CreateReviewIntoDB,
  getAllReviewForSingleBike,
};
