import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BikeServices } from './bike.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const addBike = catchAsync(async (req: Request, res: Response) => {
  const result = await BikeServices.createBikeIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bike added successfully',
    data: result,
  });
});

const getAllBikes = catchAsync(async (req: Request, res: Response) => {
  const result = await BikeServices.getAllBikesFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bikes retrieved  successfully',
    data: result,
  });
});
const getSingleBike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BikeServices.getAllSingleBikeFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bikes retrieved  successfully',
    data: result,
  });
});

// update bike data
const updateBike = catchAsync(async (req: Request, res: Response) => {
  const result = await BikeServices.updateBikeIntoDB(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bike updated successfully',
    data: result,
  });
});

const deleteBike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BikeServices.deleteBikeFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bike deleted successfully',
    data: result,
  });
});
export const BikeControllers = {
  addBike,
  getAllBikes,
  updateBike,
  deleteBike,
  getSingleBike,
};
