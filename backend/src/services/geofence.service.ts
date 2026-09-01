import Geofence from "../models/Geofence";

interface CreateGeofenceParams {
  name: string;
  type: "CIRCLE" | "POLYGON";
  latitude?: number;
  longitude?: number;
  radius?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  }[];
}

export const getGeofences = async () => {
  return Geofence.find()
    .sort({ createdAt: -1 })
    .lean();
};

export const getGeofenceById = async (
  geofenceId: string
) => {
  return Geofence.findById(geofenceId).lean();
};

export const createGeofence = async ({
  name,
  type,
  latitude,
  longitude,
  radius,
  coordinates,
}: CreateGeofenceParams) => {
  return Geofence.create({
    name,
    type,
    latitude,
    longitude,
    radius,
    coordinates,
  });
};

export const deleteGeofence = async (
  geofenceId: string
) => {
  return Geofence.findByIdAndDelete(geofenceId);
};