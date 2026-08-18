import { Request, Response } from "express";
import { getLocationsByVehicle } from "../services/location.service";
import {
  sendError,
  sendSuccessWithPagination,
} from "../utils/response";

export const getLocationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getLocationsByVehicle({
      vehicleId: req.params.vehicleId as string,
      page: req.query.page as string,
      limit: req.query.limit as string,
    });

    return sendSuccessWithPagination(
      res,
      result.locations,
      result.pagination
    );
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch locations",
      404
    );
  }
};