import { model, Schema } from 'mongoose';
import { TCoupon } from './coupon.interface';

const couponSchema = new Schema<TCoupon>({
  option: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
    required: true,
    unique: true
  },
});

export const Coupon = model<TCoupon>('Coupon', couponSchema);
