/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Bike } from '../bike/bike.model';
import { Booking } from './booking.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createBookingIntoDB = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  // start session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();
    const user = await User.findById(userId);
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
const getUserRentalsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does exist');
  }
  const rentalsQuery = new QueryBuilder(
    Booking.find({ userId })
      .populate({
        path: 'bikeId',
        select: 'name',
      })
      .populate({
        path: 'userId',
        select: 'points',
      })
      .sort({
        createdAt: -1,
      }),
    query,
  ).paginate();
  const rentals = await rentalsQuery.modelQuery;
  const meta = await rentalsQuery.countTotal();

  return {
    data: rentals,
    meta,
  };
};

// get all rentals
const getAllRentalsFromDB = async (query: Record<string, unknown>) => {
  const bookingsQuery = new QueryBuilder(
    Booking.find({}).sort({
      createdAt: -1,
    }),
    query,
  ).paginate();
  const bookings = await bookingsQuery.modelQuery;
  const meta = await bookingsQuery.countTotal();
  return {
    data: bookings,
    meta,
  };
};

// get all the canceled bookings
const getAllCanceledRentalsFromDB = async (query: Record<string, unknown>) => {
  // will populate bikeId and userId
  const bookingsQuery = new QueryBuilder(
    Booking.find({ status: 'canceled' })
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

  const bookings = await bookingsQuery.modelQuery;
  const meta = await bookingsQuery.countTotal();
  return {
    data: bookings,
    meta,
  };
};

// get all the canceled bookings
const getUserCanceledRentalsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // will populate bikeId and userId
  const bookingsQuery = new QueryBuilder(
    Booking.find({ userId, status: 'canceled' })
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

  const bookings = await bookingsQuery.modelQuery;
  const meta = await bookingsQuery.countTotal();
  return {
    data: bookings,
    meta,
  };
};

const updateBookingDetailsAfterReturn = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  if (booking.isReturned) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This bike has already been returned.',
    );
  }

  const bike = await Bike.findById(booking?.bikeId);
  if (!bike) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike not found');
  }

  // Calculating the cost
  const startTime = new Date(booking.startTime);
  const returnTime = new Date();

  // Ensure the duration is positive by using Math.abs
  const rentalDurationHours = Math.ceil(
    Math.abs(returnTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
  );

  const pricePerHour = bike?.pricePerHour as number;
  const totalCost = rentalDurationHours * pricePerHour;

  // Update bike available status
  const updateBikeStatus = await Bike.findByIdAndUpdate(
    booking.bikeId,
    {
      isAvailable: true,
    },
    {
      new: true,
    },
  );

  // Update booking data
  const updatedBookingData = await Booking.findByIdAndUpdate(
    booking._id,
    {
      isReturned: true,
      returnTime,
      totalCost,
      status: 'unpaid',
    },
    {
      new: true,
    },
  );

  return updatedBookingData;
};

const updateBookingStatusAfterPayment = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  const updateBookingStatus = await Booking.findByIdAndUpdate(
    booking._id,
    {
      status: 'paid',
    },
    {
      new: true,
    },
  );
  return updateBookingStatus;
};

// cancel booking functionalities
const cancelBookingFromDB = async (rentalId: string) => {
  const booking = await Booking.findById(rentalId);
  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }

  if (booking.isReturned) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This bike has already been returned.',
    );
  }

  const bike = await Bike.findById(booking?.bikeId);
  if (!bike) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike not found');
  }

  // Update bike available status
  const updateBikeStatus = await Bike.findByIdAndUpdate(
    booking.bikeId,
    {
      isAvailable: true,
    },
    {
      new: true,
    },
  );

  const returnTime = new Date();

  // Update booking data
  const updatedBookingData = await Booking.findByIdAndUpdate(
    booking._id,
    {
      isReturned: true,
      returnTime,
      totalCost: 0,
      status: 'canceled',
    },
    {
      new: true,
    },
  );

  return updatedBookingData;
};



export const BookingServices = {
  createBookingIntoDB,
  getUserRentalsFromDB,
  getAllCanceledRentalsFromDB,
  getUserCanceledRentalsFromDB,
  getAllRentalsFromDB,
  updateBookingDetailsAfterReturn,
  updateBookingStatusAfterPayment,
  cancelBookingFromDB,
};
