import Vehicle from "../models/Vehicle";
import mongoose from "mongoose";

interface GetVehiclesParams {
  cursor?: string;
  limit?: string;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const getVehicles = async ({
  cursor,
  limit,
  search,
  status,
  sortBy,
  sortOrder,
}: GetVehiclesParams) => {
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const filter: Record<string, unknown> = {};

  // Search by vehicle number
  if (search) {
    filter.vehicleNumber = {
      $regex: search,
      $options: "i",
    };
  }

  // Filter by vehicle status
  if (status && status !== "ALL") {
    filter.status = status;
  }

  // Cursor pagination
  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      throw new Error("Invalid cursor");
    }

    filter._id = {
      $gt: new mongoose.Types.ObjectId(cursor),
    };
  }

  const sortField =
    sortBy === "speed"
      ? "speed"
      : sortBy === "vehicleNumber"
        ? "vehicleNumber"
        : "lastUpdated";

  const sortDirection =
    sortOrder === "asc" ? 1 : -1;

  const vehicles = await Vehicle.find(filter)
    .populate(
      "driverId",
      "name phone licenseNumber status"
    )
    .sort({
      [sortField]: sortDirection,
      _id: 1,
    })
    .limit(parsedLimit + 1)
    .lean();

  const hasNextPage = vehicles.length > parsedLimit;

  if (hasNextPage) {
    vehicles.pop();
  }

  const nextCursor =
    hasNextPage && vehicles.length > 0
      ? vehicles[vehicles.length - 1]._id.toString()
      : null;

  return {
    vehicles,
    pagination: {
      nextCursor,
      hasNextPage,
      limit: parsedLimit,
      totalReturned: vehicles.length,
    },
  };
};

export const getVehicleById = async (
  vehicleId: string
) => {
  return Vehicle.findById(vehicleId)
    .populate(
      "driverId",
      "name phone licenseNumber status"
    )
    .lean();
};

export const getVehicleStats = async () => {
  const stats = await Vehicle.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    moving: 0,
    idle: 0,
    stopped: 0,
    offline: 0,
  };

  for (const stat of stats) {
    result.total += stat.count;

    switch (stat._id) {
      case "MOVING":
        result.moving = stat.count;
        break;

      case "IDLE":
        result.idle = stat.count;
        break;

      case "STOPPED":
        result.stopped = stat.count;
        break;

      case "OFFLINE":
        result.offline = stat.count;
        break;
    }
  }

  return result;
};