import Driver from "../models/Driver";

export const getDrivers = async () => {
  return Driver.find()
    .sort({ name: 1 })
    .lean();
};

export const getDriverById = async (driverId: string) => {
  return Driver.findById(driverId).lean();
};

export const getDriverStats = async () => {
  const stats = await Driver.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    active: 0,
    inactive: 0,
  };

  for (const stat of stats) {
    result.total += stat.count;

    if (stat._id === "ACTIVE") {
      result.active = stat.count;
    }

    if (stat._id === "INACTIVE") {
      result.inactive = stat.count;
    }
  }

  return result;
};