"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  vehicleNumber: string;
  status: "MOVING" | "IDLE" | "STOPPED" | "OFFLINE";
  fuel: number;
  speed: number;
}

interface Trip {
  _id: string;
  distance: number;
  duration: number;
  averageSpeed: number;
  maxSpeed: number;
  status: string;
}

interface Maintenance {
  _id: string;
  cost: number;
  status: string;
}

export default function ReportsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [vehicleRes, maintenanceRes] =
          await Promise.all([
            fetch(
              "http://localhost:5001/api/vehicles?limit=100"
            ),
            fetch(
              "http://localhost:5001/api/maintenance"
            ),
          ]);

        const vehicleData = await vehicleRes.json();
        const maintenanceData =
          await maintenanceRes.json();

        setVehicles(vehicleData.data?.vehicles || []);
        setMaintenance(
          maintenanceData.data || []
        );

        // Trips are currently vehicle-specific,
        // so we calculate available fleet trips
        // from the first vehicles returned.
        const vehicleList =
          vehicleData.data?.vehicles || [];

        if (vehicleList.length > 0) {
          const responses = await Promise.all(
            vehicleList.slice(0, 10).map(
              (vehicle: Vehicle) =>
                fetch(
                  `http://localhost:5001/api/vehicles/${vehicle._id}/trips?limit=100`
                )
                  .then((res) => res.json())
                  .catch(() => ({
                    data: [],
                  }))
            )
          );

          const allTrips = responses.flatMap(
            (result) => result.data || []
          );

          setTrips(allTrips);
        }
      } catch (error) {
        console.error(
          "Failed to load reports",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const totalDistance = trips.reduce(
    (sum, trip) => sum + (trip.distance || 0),
    0
  );

  const totalDuration = trips.reduce(
    (sum, trip) => sum + (trip.duration || 0),
    0
  );

  const averageSpeed =
    trips.length > 0
      ? trips.reduce(
          (sum, trip) =>
            sum + (trip.averageSpeed || 0),
          0
        ) / trips.length
      : 0;

  const maintenanceCost = maintenance.reduce(
    (sum, item) => sum + (item.cost || 0),
    0
  );

  const movingVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "MOVING"
  ).length;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1200px] p-4 lg:p-5">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            REPORTS // 07
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Fleet Reports
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Operational overview from fleet data
          </p>
        </div>

        {/* Metrics */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              TOTAL VEHICLES
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {loading ? "--" : vehicles.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              ACTIVE NOW
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan">
              {loading ? "--" : movingVehicles}
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              DISTANCE
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {loading
                ? "--"
                : `${totalDistance.toFixed(1)} km`}
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              MAINTENANCE COST
            </p>

            <p className="mt-2 text-2xl font-bold text-green">
              {loading
                ? "--"
                : `₹${maintenanceCost.toLocaleString(
                    "en-IN"
                  )}`}
            </p>
          </div>
        </div>

        {/* Report sections */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Trip Performance */}
          <div className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                TRIP PERFORMANCE
              </p>

              <p className="mt-1 text-[10px] text-[#58717e]">
                Fleet journey statistics
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-[#12384a]">

              <div className="bg-[#03111c] p-5">
                <p className="text-[9px] text-[#58717e]">
                  TOTAL TRIPS
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {loading ? "--" : trips.length}
                </p>
              </div>

              <div className="bg-[#03111c] p-5">
                <p className="text-[9px] text-[#58717e]">
                  AVG SPEED
                </p>

                <p className="mt-2 text-xl font-bold text-cyan">
                  {loading
                    ? "--"
                    : `${averageSpeed.toFixed(
                        1
                      )} km/h`}
                </p>
              </div>

              <div className="bg-[#03111c] p-5">
                <p className="text-[9px] text-[#58717e]">
                  TOTAL DISTANCE
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {loading
                    ? "--"
                    : `${totalDistance.toFixed(
                        1
                      )} km`}
                </p>
              </div>

              <div className="bg-[#03111c] p-5">
                <p className="text-[9px] text-[#58717e]">
                  DRIVE TIME
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {loading
                    ? "--"
                    : formatDuration(
                        totalDuration
                      )}
                </p>
              </div>

            </div>
          </div>

          {/* Maintenance */}
          <div className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                MAINTENANCE
              </p>

              <p className="mt-1 text-[10px] text-[#58717e]">
                Fleet maintenance overview
              </p>
            </div>

            <div className="space-y-0">

              {maintenance.length === 0 && !loading && (
                <div className="p-5 text-xs text-[#58717e]">
                  No maintenance records.
                </div>
              )}

              {maintenance.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b border-[#0d2b3a] px-5 py-4"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Maintenance record
                    </p>

                    <p className="mt-1 text-[9px] text-[#58717e]">
                      {item.status}
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-green">
                    ₹
                    {item.cost.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* Vehicle Status */}
        <div className="mt-5 rounded-xl border border-[#12384a] bg-[#03111c]">

          <div className="border-b border-[#12384a] px-5 py-4">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
              VEHICLE STATUS
            </p>

            <p className="mt-1 text-[10px] text-[#58717e]">
              Current fleet distribution
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#12384a] md:grid-cols-4">

            {[
              ["MOVING", "MOVING"],
              ["IDLE", "IDLE"],
              ["STOPPED", "STOPPED"],
              ["OFFLINE", "OFFLINE"],
            ].map(([label, status]) => {
              const count = vehicles.filter(
                (vehicle) =>
                  vehicle.status === status
              ).length;

              return (
                <div
                  key={status}
                  className="bg-[#03111c] p-5"
                >
                  <p className="text-[9px] text-[#58717e]">
                    {label}
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {loading ? "--" : count}
                  </p>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
}