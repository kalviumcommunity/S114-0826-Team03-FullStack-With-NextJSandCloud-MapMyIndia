import { Request, Response } from "express";
import {
  getDriverById,
  getDriverStats,
  getDrivers,
} from "../services/driver.service";
import {
  sendError,
  sendSuccess,
} from "../utils/response";

export const getDriversController = async (
  _req: Request,
  res: Response
) => {
  try {
    const drivers = await getDrivers();

    return sendSuccess(res, drivers);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch drivers"
    );
  }
};

export const getDriverController = async (
  req: Request,
  res: Response
) => {
  try {
    const driver = await getDriverById(
      req.params.id as string
    );

    if (!driver) {
      return sendError(
        res,
        "Driver not found",
        404
      );
    }

    return sendSuccess(res, driver);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch driver"
    );
  }
};

export const getDriverStatsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const stats = await getDriverStats();

    return sendSuccess(res, stats);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch driver statistics"
    );
  }
};