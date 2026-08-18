import Location from "../models/Location";
import Vehicle from "../models/Vehicle";
import { getPagination } from "../utils/pagination";

interface GetLocationsParams {
  vehicleId: string;
  page?: string;
  limit?: string;
}

export const getLocationsByVehicle = async ({
  vehicleId,
  page,
  limit,
}: GetLocationsParams) => {
  const vehicleExists = await Vehicle.exists({
    _id: vehicleId,
  });

  if (!vehicleExists) {
    throw new Error("Vehicle not found");
  }

  const pagination = getPagination(page, limit);

  const [locations, total] = await Promise.all([
    Location.find({ vehicleId })
      .sort({ timestamp: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Location.countDocuments({ vehicleId }),
  ]);

  return {
    locations,
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