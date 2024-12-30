import { User } from '../user/user.model';
import { initiatePayment } from '../../utils/initiatePayment';
import { Payment } from './payment.model';
import { TPayment } from './payment.interface';
import QueryBuilder from '../../builder/QueryBuilder';

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
      bookingId: data.bookingId,
    };
    const result = initiatePayment(info);
    return result;
  }
};

const createPaymentIntoDB = async (payload: TPayment) => {
  const payment = await Payment.create(payload);

  
  if (payload?.paymentType === 'full') {

    const points = payload.totalCost / 10;
    // add points to user profile
    const user = await User.findById(payload.userId);
    if (user) {
      const updatedPoints = (user.points as number) + points;
      await User.findByIdAndUpdate(
        payload.userId,
        {
          points: updatedPoints,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      
    }
  }
  return payment;
};

const getPaymentHistoryFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const paymentHistoryQuery = new QueryBuilder(
    Payment.find({ userId: userId }).populate('bikeId'),
    query,
  ).paginate();
  const paymentHistory = await paymentHistoryQuery.modelQuery;
  const meta = await paymentHistoryQuery.countTotal();
  return {
    data: paymentHistory,
    meta,
  };
};
const getAllPaymentHistoryFromDB = async (query: Record<string, unknown>) => {
  const paymentHistoryQuery = new QueryBuilder(
    Payment.find()
      .populate({
        path: 'bikeId',
        select: 'name',
      })
      .populate({
        path: 'userId',
        select: 'name',
      }),
    query,
  ).paginate();
  const paymentHistory = await paymentHistoryQuery.modelQuery;
  const meta = await paymentHistoryQuery.countTotal();
  return {
    data: paymentHistory,
    meta,
  };
};

export const PaymentServices = {
  makeAdvancePayment,
  createPaymentIntoDB,
  getPaymentHistoryFromDB,
  getAllPaymentHistoryFromDB,
};
