import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type GeofenceType =
  | "CIRCLE"
  | "POLYGON";

export type GeofenceStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface IGeofence extends Document {
  name: string;
  type: GeofenceType;
  status: GeofenceStatus;

  latitude?: number;
  longitude?: number;
  radius?: number;

  coordinates?: {
    latitude: number;
    longitude: number;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const geofenceSchema =
  new Schema<IGeofence>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: ["CIRCLE", "POLYGON"],
        required: true,
      },

      status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
      },

      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },

      radius: {
        type: Number,
        min: 1,
      },

      coordinates: [
        {
          latitude: Number,
          longitude: Number,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

const Geofence: Model<IGeofence> =
  mongoose.models.Geofence ||
  mongoose.model<IGeofence>(
    "Geofence",
    geofenceSchema
  );

export default Geofence;