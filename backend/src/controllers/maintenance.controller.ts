import { Request, Response } from "express";

import {
  createMaintenance,
  deleteMaintenance,
  getMaintenance,
  getMaintenanceById,
  getMaintenanceStats,
} from "../services/maintenance.service";

import {
  sendError,
  sendSuccess,
} from "../utils/response";

export const getMaintenanceController = async (
  req: Request,
  res: Response
) => {
  try {
    const maintenance = await getMaintenance({
      status: req.query.status as string,
      vehicleId: req.query.vehicleId as string,
    });

    return sendSuccess(res, maintenance);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch maintenance records"
    );
  }
};

export const getMaintenanceByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const maintenance = await getMaintenanceById(
      req.params.id as string
    );

    if (!maintenance) {
      return sendError(
        res,
        "Maintenance record not found",
        404
      );
    }

    return sendSuccess(res, maintenance);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch maintenance record"
    );
  }
};

export const createMaintenanceController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      vehicleId,
      type,
      description,
      scheduledDate,
      completedDate,
      cost,
      status,
    } = req.body;

    if (
      !vehicleId ||
      !type ||
      !description ||
      !scheduledDate
    ) {
      return sendError(
        res,
        "Vehicle, type, description and scheduled date are required",
        400
      );
    }

    const maintenance =
      await createMaintenance({
        vehicleId,
        type,
        description,
        scheduledDate,
        completedDate,
        cost,
        status,
      });

    return sendSuccess(res, maintenance, 201);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to create maintenance record"
    );
  }
};

export const deleteMaintenanceController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const maintenance =
        await deleteMaintenance(
          req.params.id as string
        );

      if (!maintenance) {
        return sendError(
          res,
          "Maintenance record not found",
          404
        );
      }

      return sendSuccess(res, {
        message:
          "Maintenance record deleted successfully",
      });
    } catch (error) {
      return sendError(
        res,
        error instanceof Error
          ? error.message
          : "Failed to delete maintenance record"
      );
    }
  };

export const getMaintenanceStatsController =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const stats =
        await getMaintenanceStats();

      return sendSuccess(res, stats);
    } catch (error) {
      return sendError(
        res,
        error instanceof Error
          ? error.message
          : "Failed to fetch maintenance statistics"
      );
    }
  };