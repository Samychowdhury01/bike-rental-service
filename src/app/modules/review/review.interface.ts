import { Types } from 'mongoose';

export type TReview = {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  userName: string;
  rating: number;
  review: string;
};
