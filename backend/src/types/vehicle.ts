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

// 📡 Day 4 API Query Parameters & Response Structure
export interface VehicleQueryParams {
    cursor?: string;
    limit?: number;
    search?: string;
    status?: VehicleStatus | 'ALL';
    sortBy?: 'lastUpdated' | 'vehicleNumber' | 'speed';
    sortOrder?: 'asc' | 'desc';
}

export interface VehicleListApiResponse {
    success: boolean;
    data?: {
        vehicles: IVehicleDocument[];
        pagination: {
            nextCursor: string | null;
            hasNextPage: boolean;
            limit: number;
            totalReturned: number;
        };
    };
    error?: {
        code: string;
        message: string;
    };
}