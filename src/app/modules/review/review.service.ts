import { TReview } from './review.interface';
import Review from './review.model';

import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';

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
const getUserReviewsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const reviewQuery = new QueryBuilder(
    Review.find({
      userId,
    })
      .populate({
        path: 'bikeId',
      })
      .sort({
        createdAt: -1,
      }),
    query,
  ).paginate();

  const reviews = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return {
    reviews,
    meta,
  };
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewsQuery = new QueryBuilder(
    Review.find({})
      .populate({
        path: 'bikeId',
        select: 'name',
      })
      .sort({
        createdAt: -1,
      }),
    query,
  ).paginate();
  const reviews = await reviewsQuery.modelQuery
  const meta = await reviewsQuery.countTotal();
  return {
    reviews,
    meta,
  }
  
};
export const ReviewServices = {
  CreateReviewIntoDB,
  getAllReviewForSingleBike,
  getUserReviewsFromDB,
  getAllReviewsFromDB,
};
