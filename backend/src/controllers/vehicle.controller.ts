import { Request, Response } from "express";
import {
  getVehicleById,
  getVehicleStats,
  getVehicles,
} from "../services/vehicle.service";
import {
  sendError,
  sendSuccess,
} from "../utils/response";

export const getVehiclesController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getVehicles({
      cursor: req.query.cursor as string,
      limit: req.query.limit as string,
      search: req.query.search as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    });

    return sendSuccess(res, result);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch vehicles"
    );
  }
};

export const getVehicleController = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicle = await getVehicleById(
      req.params.id as string
    );

    if (!vehicle) {
      return sendError(
        res,
        "Vehicle not found",
        404
      );
    }

    return sendSuccess(res, vehicle);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch vehicle";

    if (
      message.includes(
        "Cast to ObjectId failed"
      )
    ) {
      return sendError(
        res,
        "Invalid vehicle ID",
        400
      );
    }

    return sendError(res, message);
  }
};

export const getVehicleStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const stats = await getVehicleStats();

    return sendSuccess(res, stats);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch vehicle statistics"
    );
  }
};