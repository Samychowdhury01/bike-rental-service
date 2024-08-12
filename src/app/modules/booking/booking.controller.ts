import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BookingServices } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user;
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
  const result = await BookingServices.getUserRentalsFromDB(req?.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rentals retrieved successfully',
    data: result,
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
export const BookingControllers = {
  createBooking,
  getUserRentals,
  returnedBike,
};
