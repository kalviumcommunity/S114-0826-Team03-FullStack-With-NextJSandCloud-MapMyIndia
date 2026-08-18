import Vehicle from "../models/Vehicle";
import { getPagination } from "../utils/pagination";

interface GetVehiclesParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

export const getVehicles = async ({
  page,
  limit,
  search,
  status,
}: GetVehiclesParams) => {
  const pagination = getPagination(page, limit);

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.vehicleNumber = {
      $regex: search,
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter)
      .populate("driverId", "name phone licenseNumber status")
      .sort({ vehicleNumber: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Vehicle.countDocuments(filter),
  ]);

  return {
    vehicles,
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

export const getVehicleById = async (vehicleId: string) => {
  return Vehicle.findById(vehicleId)
    .populate("driverId", "name phone licenseNumber status")
    .lean();
};