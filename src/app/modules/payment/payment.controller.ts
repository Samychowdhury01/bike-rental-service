/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PaymentServices } from './payment.service';
import { BookingServices } from '../booking/booking.service';
import config from '../../config';
import { Types } from 'mongoose';
import { TPayment } from './payment.interface';

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
  const { userId, bikeId, startTime, totalCost, bookingId, transactionId } =
    req.query;

  const paymentPayload = {
    userId: new Types.ObjectId(userId as string),
    bikeId: new Types.ObjectId(bikeId as string),
  };

  if (Number(totalCost) === 0) {
    const payload = {
      bikeId,
      startTime,
    };
    const advancePaymentPayload = {
      ...paymentPayload,
      paymentType: 'advance',
      transactionId,
      totalCost: 100,
    };

    const createPayment = await PaymentServices.createPaymentIntoDB(
      advancePaymentPayload as TPayment,
    );

    const result = await BookingServices.createBookingIntoDB(
      userId as string,
      payload,
    );

    res.redirect(config.success_url as string);
  }

  if (Number(totalCost) !== 0) {
    const fullPaymentPayload = {
      ...paymentPayload,
      transactionId,
      paymentType: 'full',
      totalCost: Number(totalCost),
    };
    const result = await BookingServices.updateBookingStatusAfterPayment(
      bookingId as string,
    );

    if (result) {
      const createPayment = await PaymentServices.createPaymentIntoDB(
        fullPaymentPayload as TPayment,
      );
      res.redirect(config.success_url as string);
    }
  }
});

const isCanceled = catchAsync(async (req: Request, res: Response) => {
  res.redirect(config.cancel_url as string);
});

// get user payment history
const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await PaymentServices.getPaymentHistoryFromDB(
    userId,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment history retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
// admin can access all the payment history
const getAllPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getAllPaymentHistoryFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment history retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const usePoints = catchAsync(async (req, res) => {
  const { rentalId } = req.params;
  const result = await PaymentServices.payThroughPoints(rentalId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const PaymentControllers = {
  advancePayment,
  isConfirmed,
  makePayment,
  isCanceled,
  getPaymentHistory,
  getAllPaymentHistory,
  usePoints,
};
