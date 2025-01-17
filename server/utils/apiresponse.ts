import { Response } from 'express';

export interface ApiResponseData {
  [key: string]: any;
}

export interface ApiResponseOptions {
  status: boolean;
  data?: ApiResponseData;
  message?: string;
  statusCode?: number;
}

export interface ApiErrorOptions {
  status: boolean;
  data?: ApiResponseData;
  message?: string;
  statusCode?: number;
}

export const sendApiResponse = (res: Response, options: ApiResponseOptions): Response => {
  const { status, data = {}, message = '', statusCode = 200 } = options;

  return res.status(statusCode).json({
    status,
    data,
    message,
  });
};

export const sendErrorResponse = (res: Response, options: ApiErrorOptions): Response => {
  const { status, data = {}, message = '', statusCode = 500 } = options;

  return res.status(statusCode).json({
    status,
    data,
    message,
  });
};