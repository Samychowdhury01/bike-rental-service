import { Coupon } from './coupon.model';
import { TCoupon } from './coupon.interface';

// get all rentals for User
const createCouponIntoDB = async (payload: TCoupon) => {
  const result = await Coupon.create(payload);
  return result;
};

const getAllCouponsFroDB = async () => {
  const result = await Coupon.find();
  return result;
};
const deleteCouponFromDB = async (id: string) => {
  const isExist = await Coupon.findById(id);
  if (!isExist) {
    throw new Error('Coupon not found');
  }
  const result = await Coupon.findByIdAndDelete(id);
  return result;
};

export const CouponServices = {
  createCouponIntoDB,
  getAllCouponsFroDB,
  deleteCouponFromDB,
};
