export type VehicleStatus = 'MOVING' | 'IDLE' | 'STOPPED' | 'OFFLINE';

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverName?: string;
  driverId?: string;
  status: VehicleStatus;
  fuel: number;
  speed: number;
  heading: number;
  lastUpdated: string;
  latitude: number;
  longitude: number;
}

export interface VehiclePaginationMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
  totalReturned: number;
}

export interface VehicleListApiResponse {
  success: boolean;
  data?: {
    vehicles: Vehicle[];
    pagination: VehiclePaginationMeta;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface VehicleFilterState {
  searchQuery: string;
  statusFilter: VehicleStatus | 'ALL';
  sortBy: 'lastUpdated' | 'vehicleNumber' | 'speed';
  sortOrder: 'asc' | 'desc';
}