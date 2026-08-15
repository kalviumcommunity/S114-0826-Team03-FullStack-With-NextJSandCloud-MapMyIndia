import mongoose, { Document, Schema, Types } from "mongoose";

export type TripStatus =
  | "COMPLETED"
  | "ONGOING"
  | "CANCELLED";

export interface ITrip extends Document {
  vehicleId: Types.ObjectId;

  startTime: Date;
  endTime?: Date;

  startLatitude: number;
  startLongitude: number;

  endLatitude?: number;
  endLongitude?: number;

  distance: number;
  duration: number;

  averageSpeed: number;
  maxSpeed: number;

  status: TripStatus;

  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
    },

    startLatitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    startLongitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    endLatitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    endLongitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    distance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    averageSpeed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    maxSpeed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["COMPLETED", "ONGOING", "CANCELLED"],
      default: "ONGOING",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ vehicleId: 1, startTime: -1 });

const Trip = mongoose.model<ITrip>("Trip", tripSchema);

export default Trip;