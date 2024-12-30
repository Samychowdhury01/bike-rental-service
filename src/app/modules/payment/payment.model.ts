import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalCost: {
      type: Number,
    },
    paymentType: {
      type: String,
      enum: ['full', 'advance'],
    },
    transactionId: { type: String, unique: true, default: null },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<TPayment>('Payment', paymentSchema);
