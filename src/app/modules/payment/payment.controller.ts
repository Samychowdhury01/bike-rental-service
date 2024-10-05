/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PaymentServices } from './payment.service';
import { BookingServices } from '../booking/booking.service';
import config from '../../config';
import { TCreateBooking } from '../booking/booking.interface';

const advancePayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const info = { ...req.body, amount: 100, totalCost: 0, bookingId: '' };
  const result = await PaymentServices.makeAdvancePayment(userId, info);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bike returned successfully',
    data: result,
  });
});

const makePayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const info = req.body;
  const result = await PaymentServices.makeAdvancePayment(userId, info);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bike returned successfully',
    data: result,
  });
});

const isConfirmed = catchAsync(async (req: Request, res: Response) => {
  const { userId, bikeId, startTime, totalCost, bookingId } = req.query;

  if (Number(totalCost) === 0) {
    const payload = {
      bikeId,
      startTime,
    };
    const result = await BookingServices.createBookingIntoDB(
      userId as string,
      payload,
    );
    res.redirect(config.success_url as string);
  }
  if (Number(totalCost) !== 0) {
    const result = await BookingServices.updateBookingStatusAfterPayment(
      bookingId as string,
    );

    if (result) {
      res.redirect(config.success_url as string);
    }
  }
});
const isCanceled = catchAsync(async (req: Request, res: Response) => {
  res.redirect(config.cancel_url as string);
});

export const PaymentControllers = {
  advancePayment,
  isConfirmed,
  makePayment,
  isCanceled,
};
