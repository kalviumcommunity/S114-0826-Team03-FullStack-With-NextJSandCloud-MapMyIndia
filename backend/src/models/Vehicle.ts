import mongoose, { Document, Schema, Types } from "mongoose";

export type VehicleStatus =
  | "MOVING"
  | "IDLE"
  | "STOPPED"
  | "OFFLINE";

export interface IVehicle extends Document {
  vehicleNumber: string;
  driverId: Types.ObjectId;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["MOVING", "IDLE", "STOPPED", "OFFLINE"],
      default: "OFFLINE",
      index: true,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    speed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    heading: {
      type: Number,
      required: true,
      min: 0,
      max: 360,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;