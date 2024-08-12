import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TBike } from './bike.interface';
import { Bike } from './bike.model';

const createBikeIntoDB = async (payload: TBike) => {
  const result = await Bike.create(payload);
  return result;
};

const getAllBikesFromDB = async () => {
  const bikes = await Bike.find();
  return bikes;
};

// update bike
const updateBikeIntoDB = async (id: string, payload: Partial<TBike>) => {
  const bike = await Bike.isBikeExists(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }
  const result = await Bike.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    projection: {
      isDeleted: 0,
    },
  });
  return result;
};

const deleteBikeFromDB = async (id: string) => {
  const bike = await Bike.findById(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }
  if (bike.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }
  const result = await Bike.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      projection: {
        isDeleted: 0,
      },
    },
  );
  return result;
};

export const BikeServices = {
  createBikeIntoDB,
  getAllBikesFromDB,
  updateBikeIntoDB,
  deleteBikeFromDB,
};
