import { Vehicle } from '@/types/vehicle';

export const MOCK_VEHICLES: Vehicle[] = [
    {
        id: '65e8a9bc7f2e1a3b4c5d6e01',
        vehicleNumber: 'DL-01-AA-1001',
        driverName: 'Aarav Sharma',
        status: 'MOVING',
        fuel: 85,
        speed: 58,
        heading: 90,
        lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
        latitude: 28.6139,
        longitude: 77.209,
    },
    {
        id: '65e8a9bc7f2e1a3b4c5d6e02',
        vehicleNumber: 'MH-02-BB-2002',
        driverName: 'Vikram Singh',
        status: 'MOVING',
        fuel: 42,
        speed: 74,
        heading: 180,
        lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
        latitude: 19.076,
        longitude: 72.8777,
    },
    {
        id: '65e8a9bc7f2e1a3b4c5d6e03',
        vehicleNumber: 'KA-03-CC-3003',
        driverName: 'Rohan Mehta',
        status: 'IDLE',
        fuel: 60,
        speed: 0,
        heading: 0,
        lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(),
        latitude: 12.9716,
        longitude: 77.5946,
    },
    {
        id: '65e8a9bc7f2e1a3b4c5d6e04',
        vehicleNumber: 'TN-07-DD-4004',
        driverName: 'Karthik Raja',
        status: 'STOPPED',
        fuel: 95,
        speed: 0,
        heading: 270,
        lastUpdated: new Date(Date.now() - 120 * 60000).toISOString(),
        latitude: 13.0827,
        longitude: 80.2707,
    },
];

export function getMockVehiclePage(cursor: string | null = null, limit = 2) {
    const startIndex = cursor ? MOCK_VEHICLES.findIndex((v) => v.id === cursor) + 1 : 0;
    const sliced = MOCK_VEHICLES.slice(startIndex, startIndex + limit);
    const nextCursor = sliced.length === limit ? sliced[sliced.length - 1].id : null;

    return {
        vehicles: sliced,
        nextCursor,
        hasNextPage: nextCursor !== null,
    };
}