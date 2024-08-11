import { Response } from 'express';

type TResponse = {
  statusCode: number;
  success: boolean;
  message?: string;
};

const authErrorResponse = (res: Response, data: TResponse) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
  });
};

export default authErrorResponse;
