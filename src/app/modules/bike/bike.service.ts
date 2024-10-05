import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TBike } from './bike.interface';
import { Bike } from './bike.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createBikeIntoDB = async (payload: TBike) => {
  const result = await Bike.create(payload);
  return result;
};

// const getAllBikesFromDB = async () => {
//   const bikes = await Bike.find();
//   return bikes;
// };

const getAllBikesFromDB = async (query: Record<string, unknown>) => {
  const bikeQuery = new QueryBuilder(Bike.find(), query).filter();
  const result = await bikeQuery.modelQuery;

  return result;
};
const getAllSingleBikeFromDB = async (id : string) => {
  const bike = await Bike.findById(id)

  if(!bike){
    throw new AppError( httpStatus.NOT_FOUND, 'Bike not found')
  }
  return bike;
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
  getAllSingleBikeFromDB
};
