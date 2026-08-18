import Trip from "../models/Trip";
import Vehicle from "../models/Vehicle";
import { getPagination } from "../utils/pagination";

interface GetTripsParams {
  vehicleId: string;
  page?: string;
  limit?: string;
  status?: string;
}

export const getTripsByVehicle = async ({
  vehicleId,
  page,
  limit,
  status,
}: GetTripsParams) => {
  const vehicleExists = await Vehicle.exists({
    _id: vehicleId,
  });

  if (!vehicleExists) {
    throw new Error("Vehicle not found");
  }

  const pagination = getPagination(page, limit);

  const filter: Record<string, unknown> = {
    vehicleId,
  };

  if (status) {
    filter.status = status;
  }

  const [trips, total] = await Promise.all([
    Trip.find(filter)
      .sort({ startTime: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Trip.countDocuments(filter),
  ]);

  return {
    trips,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNextPage:
        pagination.page * pagination.limit < total,
      hasPreviousPage: pagination.page > 1,
    },
  };
};

export const getTripById = async (tripId: string) => {
  return Trip.findById(tripId)
    .populate("vehicleId", "vehicleNumber status")
    .lean();
};