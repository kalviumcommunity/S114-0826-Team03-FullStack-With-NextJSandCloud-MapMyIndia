import { Request, Response, NextFunction } from "express";

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  if (
    req.query.page !== undefined &&
    (!Number.isInteger(page) || page < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "page must be a positive integer",
    });
  }

  if (
    req.query.limit !== undefined &&
    (!Number.isInteger(limit) || limit < 1 || limit > 100)
  ) {
    return res.status(400).json({
      success: false,
      message: "limit must be between 1 and 100",
    });
  }

  next();
};