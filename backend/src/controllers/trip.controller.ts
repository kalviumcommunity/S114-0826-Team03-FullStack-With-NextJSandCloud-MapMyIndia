import { Request, Response } from "express";
import {
  getTripById,
  getTripsByVehicle,
} from "../services/trip.service";
import {
  sendError,
  sendSuccess,
  sendSuccessWithPagination,
} from "../utils/response";

export const getTripsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getTripsByVehicle({
      vehicleId: req.params.vehicleId as string,
      page: req.query.page as string,
      limit: req.query.limit as string,
      status: req.query.status as string,
    });

    return sendSuccessWithPagination(
      res,
      result.trips,
      result.pagination
    );
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch trips",
      404
    );
  }
};

export const getTripController = async (
  req: Request,
  res: Response
) => {
  try {
    const trip = await getTripById(req.params.id as string);

    if (!trip) {
      return sendError(res, "Trip not found", 404);
    }

    return sendSuccess(res, trip);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch trip"
    );
  }
};