import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    userName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

const Review = model<TReview>('Review', reviewSchema);

export default Review;
