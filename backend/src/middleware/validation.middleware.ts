import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  // Page validation
  if (
    req.query.page !== undefined &&
    (!Number.isInteger(page) || page < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "page must be a positive integer",
    });
  }

  // Limit validation
  if (
    req.query.limit !== undefined &&
    (!Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100)
  ) {
    return res.status(400).json({
      success: false,
      message: "limit must be between 1 and 100",
    });
  }

  // Cursor validation
  if (req.query.cursor !== undefined) {
    const cursor = req.query.cursor as string;

    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cursor",
      });
    }
  }

  // sortBy validation
  if (req.query.sortBy !== undefined) {
    const allowedSortFields = [
      "lastUpdated",
      "vehicleNumber",
      "speed",
    ];

    if (
      !allowedSortFields.includes(
        req.query.sortBy as string
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy value",
      });
    }
  }

  // sortOrder validation
  if (req.query.sortOrder !== undefined) {
    const allowedSortOrders = ["asc", "desc"];

    if (
      !allowedSortOrders.includes(
        req.query.sortOrder as string
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortOrder value",
      });
    }
  }

  next();
};