import { Types } from 'mongoose';

export type TPayment = {
  bikeId: Types.ObjectId;
  userId: Types.ObjectId;
  totalCost: number
  paymentType: 'advance'| 'full'
  transactionId?: string;
};
