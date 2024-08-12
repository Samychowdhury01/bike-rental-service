/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { IBikeModel, TBike } from './bike.interface';
// 2. Create a Schema corresponding to the document interface.
const bikeSchema = new Schema<TBike, IBikeModel>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  cc: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
// removing isDeleted flag from response doc
bikeSchema.post('save', async function (doc: any, next) {
  delete doc._doc.isDeleted;
  next();
});
// pre hook to filter out deleted document
bikeSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } }).select('-isDeleted');
  next();
});
// static method to find out bike exist or not
bikeSchema.statics.isBikeExists = async function (id: string) {
  const existingBike = await Bike.findOne({
    _id: id,
    isDeleted: { $ne: true },
  }).select('-isDeleted');
  return existingBike;
};

// 3. Create a Model.
export const Bike = model<TBike, IBikeModel>('Bike', bikeSchema);
