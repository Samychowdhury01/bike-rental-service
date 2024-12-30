import { Response } from 'express';

type TMeta = {
  page: number
      limit :number,
      total:number,
      totalPage: number,
}
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data?: T;
  meta?: TMeta 
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    token: data.token,
    data: data.data,
    meta: data.meta
  });
};

export default sendResponse;
