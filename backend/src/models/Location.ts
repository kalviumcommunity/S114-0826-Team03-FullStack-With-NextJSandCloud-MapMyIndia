import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILocation extends Document {
  vehicleId: Types.ObjectId;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
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

    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({ vehicleId: 1, timestamp: -1 });

const Location = mongoose.model<ILocation>(
  "Location",
  locationSchema
);

export default Location;