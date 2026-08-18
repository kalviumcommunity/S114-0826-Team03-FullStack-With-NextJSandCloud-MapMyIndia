import { Types } from 'mongoose';

export type VehicleStatus = 'MOVING' | 'IDLE' | 'STOPPED' | 'OFFLINE';

export interface IVehicleCore {
  vehicleNumber: string;
  driverId?: Types.ObjectId | string;
  driverName?: string;
  status: VehicleStatus;
  fuel: number;
  speed: number;
  heading: number;
  lastUpdated: Date;
  latitude: number;
  longitude: number;
}

export interface IVehicleDocument extends IVehicleCore {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}