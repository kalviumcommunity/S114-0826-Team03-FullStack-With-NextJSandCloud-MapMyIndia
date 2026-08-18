import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendSuccessWithPagination = <T>(
  res: Response,
  data: T,
  pagination: object,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};