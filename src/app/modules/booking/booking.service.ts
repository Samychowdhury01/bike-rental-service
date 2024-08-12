/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TCreateBooking } from './booking.interface';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Bike } from '../bike/bike.model';
import { Booking } from './booking.model';

const createBookingIntoDB = async (
  userData: JwtPayload,
  payload: TCreateBooking,
) => {
  // start session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();
    const user = await User.findById(userData.userId);
    const bike = await Bike.findById(payload.bikeId);

    // check if the user exist
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wrong user ID');
    }
    // check if user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'The user already deleted');
    }
    // check if the user exist
    if (!bike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wrong Bike ID');
    }
    // check if user is deleted
    if (bike.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'The bike is already deleted');
    }
    if (!bike.isAvailable) {
      throw new AppError(httpStatus.BAD_REQUEST, 'The bike is not available');
    }

    // create booking
    const bookingData = {
      userId: user._id,
      bikeId: bike._id,
      startTime: payload.startTime,
    };
    const booking = await Booking.create([bookingData], { session });
    //create a student
    if (!booking.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Booking');
    }
    // change available status of bike
    const changeBikeAvailableStatus = await Bike.findByIdAndUpdate(bike._id, {
      isAvailable: false,
    });

    await session.commitTransaction();
    await session.endSession();

    return booking[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// get all rentals for User
const getUserRentalsFromDB = async (userId: string) => {
  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does exist');
  }
  const bookings = await Booking.find({ userId });
  return bookings
};

export const BookingServices = {
  createBookingIntoDB,
  getUserRentalsFromDB
};
