import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  transactionId: { type: String, unique: true, default: null },
  
});

export const Payment = model<TPayment>('Payment', paymentSchema);
