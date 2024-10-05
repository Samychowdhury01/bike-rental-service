/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { Bike } from '../bike/bike.model';
import { Booking } from '../booking/booking.model';
// get profile data of the user
const getProfileFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  // removing the isDeleted flag and password  from response
  const { isDeleted, password, ...restData } = user.toObject();
  return restData;
};
const getAllUsersFromDB = async () => {
  const users = await User.find({
    isDeleted: { $ne: true },
  });

  return users;
};

// update profile data of the user
const updateProfileIntoDB = async (id: string, payload: Partial<TUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  // check if it's deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  // hashing the pass if provided
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload?.password,
      Number(config.sault_rounds),
    );
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    projection: {
      isDeleted: 0,
      password: 0,
    },
  });
  return result;
};

const promoteUserIntoDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  // promote user
  const result = await User.findByIdAndUpdate(
    id,
    { role: 'admin' },
    {
      new: true,
    },
  );
  return result;
};
const removeUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }
  // remove user
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

const dashBoardDataFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Data Found');
  }

  // If user is "admin"
  if (user.role === 'admin') {
    // Using countDocuments for better performance
    const totalBikes = await Bike.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    const totalPaidBookings = await Booking.countDocuments({ status: 'paid' });
    const totalUsers = await User.countDocuments({});
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email phone address'); // Not clear why sorting recentUsers is needed when just counting
    const averagePaidBookings =
      totalBookings > 0 ? (totalPaidBookings / totalBookings) * 100 : 0;

    return {
      totalBikes,
      totalBookings,
      totalUsers,
      recentUsers,
      averagePaidBookings,
    };
  }

  if (user.role === 'user') {
    let spentAmounts = 0;
    let hours = 0;
    let averageCostPerHour = 0;

    // Fetching user's bookings
    const bookings = await Booking.find({ userId: id })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'bikeId',
          select: 'name',
        },
      ]);

    if (bookings.length > 0) {
      // Calculate total spent amount
      spentAmounts = bookings.reduce(
        (acc, booking) => acc + (booking.totalCost || 0),
        0,
      );

      // Calculate total hours rented
      bookings.forEach((booking) => {
        if (booking.returnTime && booking.startTime) {
          const diffInMilliseconds =
            Number(booking.returnTime) - Number(booking.startTime);
          const totalHours = diffInMilliseconds / (1000 * 60 * 60); // Convert to hours
          hours += totalHours;
        }
      });

      // Avoid division by zero
      if (hours > 0) {
        averageCostPerHour = Number((spentAmounts / hours).toFixed(2));
      }
    }

    return {
      spentAmounts,
      hours: Number(hours.toFixed(2)),
      averageCostPerHour,
      bookings,
    };
  }
};

export const UserServices = {
  getProfileFromDB,
  updateProfileIntoDB,
  promoteUserIntoDB,
  removeUserFromDB,
  getAllUsersFromDB,
  dashBoardDataFromDB,
};
