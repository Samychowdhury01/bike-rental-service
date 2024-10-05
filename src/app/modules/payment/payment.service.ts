import { User } from '../user/user.model';
import { initiatePayment } from '../../utils/initiatePayment';
import { Payment } from './payment.model';
import { Types } from 'mongoose';

const makeAdvancePayment = async (
  userId: string,
  data: Record<string, unknown>,
) => {
  const user = await User.findById(userId);
  if (user) {
    const info = {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user.address,
      amount: data.amount,
      userId: user._id,
      bikeId: data.bikeId,
      startTime: data.startTime,
      totalCost: data.totalCost === 0 ? data.totalCost : data.amount,
      bookingId: data.bookingId
    };
    const result = initiatePayment(info);
    return result;
  }
};


const createPaymentIntoDB = async (payload: { bookingId: Types.ObjectId }) => {
  const result = await Payment.create(payload);
  return result;
};

export const PaymentServices = {
  makeAdvancePayment,
  createPaymentIntoDB,
};
