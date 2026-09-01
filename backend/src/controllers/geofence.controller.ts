import { Request, Response } from "express";

import {
  createGeofence,
  deleteGeofence,
  getGeofenceById,
  getGeofences,
} from "../services/geofence.service";

import {
  sendError,
  sendSuccess,
} from "../utils/response";

export const getGeofencesController = async (
  _req: Request,
  res: Response
) => {
  try {
    const geofences = await getGeofences();

    return sendSuccess(res, geofences);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch geofences"
    );
  }
};

export const getGeofenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const geofence = await getGeofenceById(
      req.params.id as string
    );

    if (!geofence) {
      return sendError(
        res,
        "Geofence not found",
        404
      );
    }

    return sendSuccess(res, geofence);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to fetch geofence"
    );
  }
};

export const createGeofenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      type,
      latitude,
      longitude,
      radius,
      coordinates,
    } = req.body;

    if (!name || !type) {
      return sendError(
        res,
        "Name and type are required",
        400
      );
    }

    if (
      type === "CIRCLE" &&
      (
        latitude === undefined ||
        longitude === undefined ||
        radius === undefined
      )
    ) {
      return sendError(
        res,
        "Circle geofence requires latitude, longitude and radius",
        400
      );
    }

    if (
      type === "POLYGON" &&
      (
        !Array.isArray(coordinates) ||
        coordinates.length < 3
      )
    ) {
      return sendError(
        res,
        "Polygon geofence requires at least 3 coordinates",
        400
      );
    }

    const geofence = await createGeofence({
      name,
      type,
      latitude,
      longitude,
      radius,
      coordinates,
    });

    return sendSuccess(res, geofence, 201);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to create geofence"
    );
  }
};

export const deleteGeofenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const geofence = await deleteGeofence(
      req.params.id as string
    );

    if (!geofence) {
      return sendError(
        res,
        "Geofence not found",
        404
      );
    }

    return sendSuccess(res, {
      message: "Geofence deleted successfully",
    });
  } catch (error) {
    return sendError(
      res,
      error instanceof Error
        ? error.message
        : "Failed to delete geofence"
    );
  }
};