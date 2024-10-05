import { Types } from 'mongoose';

export type TPayment = {
  bookingId: Types.ObjectId;
  transactionId?: string;
};
