import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BookingServices } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user.userId;
  const result = await BookingServices.createBookingIntoDB(userData, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental created successfully',
    data: result,
  });
});

// get rentals of a specific user using userId which extracted from req.user
const getUserRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getUserRentalsFromDB(
    req?.user.userId,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rentals retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
// get all the canceled rentals (by admin)
const getAllCanceledRentals = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingServices.getAllCanceledRentalsFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Canceled rentals retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);

// get all user canceled rentals (by user)
const getUserCanceledRentals = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingServices.getUserCanceledRentalsFromDB(
      req.user.userId,
      req.query,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Canceled rentals retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getAllRentalsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rentals retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

// update booking details after return the bike
const returnedBike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingServices.updateBookingDetailsAfterReturn(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bike returned successfully',
    data: result,
  });
});

// update booking details after return the bike
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingServices.cancelBookingFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking canceled successfully',
    data: result,
  });
});

export const BookingControllers = {
  createBooking,
  getUserRentals,
  getAllCanceledRentals,
  getUserCanceledRentals,
  returnedBike,
  getAllRentals,
  cancelBooking,
};
