/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '../user/user.model';
import { initiatePayment } from '../../utils/initiatePayment';
import { Payment } from './payment.model';
import { TPayment } from './payment.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { Bike } from '../bike/bike.model';
import { Booking } from '../booking/booking.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

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

// pay through points
const payThroughPoints = async (rentalId: string) => {
  const booking = await Booking.findById(rentalId);
  const user = await User.findById(booking?.userId);
  const bike = await Bike.findById(booking?.bikeId);

  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Check if the user has enough points
  if ((booking.totalCost as number) > (user?.points as number)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient points');
  }
  // Update user points
  const updatedUserPoints = await User.findByIdAndUpdate(
    user._id,
    {
      points: (user.points as number) - (booking.totalCost as number),
    },
    {
      new: true,
      runValidators: true,
    },
  );
  // Update booking status
  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    {
      status: 'paid',
      isReturned: true,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  // Update bike status
  const updatedBike = await Bike.findByIdAndUpdate(
    bike!._id,
    {
      isAvailable: true,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedBooking;
};
export const PaymentServices = {
  makeAdvancePayment,
  createPaymentIntoDB,
  getPaymentHistoryFromDB,
  getAllPaymentHistoryFromDB,
  payThroughPoints
};
