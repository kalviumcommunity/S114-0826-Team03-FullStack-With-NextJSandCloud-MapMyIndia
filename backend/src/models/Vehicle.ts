import mongoose, { Document, Schema, Types, Model } from 'mongoose';

export type VehicleStatus = 'MOVING' | 'IDLE' | 'STOPPED' | 'OFFLINE';

export interface IVehicle extends Document {
  vehicleNumber: string;
  driverId?: Types.ObjectId;
  driverName?: string;
  status: VehicleStatus;
  fuel: number;
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
      uppercase: true,
      index: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      required: false,
      index: true,
    },
    driverName: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ['MOVING', 'IDLE', 'STOPPED', 'OFFLINE'],
      default: 'OFFLINE',
      index: true,
    },
    fuel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
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
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: unknown, ret: Record<string, any>) => {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// 🚀 Lane 1 Performance Indexes
vehicleSchema.index({ status: 1, lastUpdated: -1 });
vehicleSchema.index({ vehicleNumber: 1 });
vehicleSchema.index({ vehicleNumber: 'text', driverName: 'text' } as any);

const Vehicle: Model<IVehicle> =
  mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;