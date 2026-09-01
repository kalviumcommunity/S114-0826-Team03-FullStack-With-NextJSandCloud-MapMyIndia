import Maintenance from "../models/Maintenance";
import Vehicle from "../models/Vehicle";

interface GetMaintenanceParams {
  status?: string;
  vehicleId?: string;
}

interface CreateMaintenanceParams {
  vehicleId: string;
  type:
    | "SERVICE"
    | "REPAIR"
    | "INSPECTION"
    | "TYRE"
    | "OTHER";
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  status?:
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
}

export const getMaintenance = async ({
  status,
  vehicleId,
}: GetMaintenanceParams) => {
  const filter: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    filter.status = status;
  }

  if (vehicleId) {
    filter.vehicleId = vehicleId;
  }

  return Maintenance.find(filter)
    .populate(
      "vehicleId",
      "vehicleNumber status"
    )
    .sort({ scheduledDate: 1 })
    .lean();
};

export const getMaintenanceById = async (
  maintenanceId: string
) => {
  return Maintenance.findById(maintenanceId)
    .populate(
      "vehicleId",
      "vehicleNumber status"
    )
    .lean();
};

export const createMaintenance = async ({
  vehicleId,
  type,
  description,
  scheduledDate,
  completedDate,
  cost,
  status,
}: CreateMaintenanceParams) => {
  const vehicleExists = await Vehicle.exists({
    _id: vehicleId,
  });

  if (!vehicleExists) {
    throw new Error("Vehicle not found");
  }

  return Maintenance.create({
    vehicleId,
    type,
    description,
    scheduledDate,
    completedDate,
    cost: cost ?? 0,
    status: status ?? "SCHEDULED",
  });
};

export const deleteMaintenance = async (
  maintenanceId: string
) => {
  return Maintenance.findByIdAndDelete(
    maintenanceId
  );
};

export const getMaintenanceStats = async () => {
  const stats = await Maintenance.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalCost: { $sum: "$cost" },
      },
    },
  ]);

  const result = {
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    totalCost: 0,
  };

  for (const stat of stats) {
    result.total += stat.count;
    result.totalCost += stat.totalCost;

    switch (stat._id) {
      case "SCHEDULED":
        result.scheduled = stat.count;
        break;

      case "IN_PROGRESS":
        result.inProgress = stat.count;
        break;

      case "COMPLETED":
        result.completed = stat.count;
        break;

      case "CANCELLED":
        result.cancelled = stat.count;
        break;
    }
  }

  return result;
};