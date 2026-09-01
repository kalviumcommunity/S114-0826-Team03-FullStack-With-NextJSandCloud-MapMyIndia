"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  vehicleNumber: string;
}

interface Trip {
  _id: string;
  vehicleId: string;
  vehicleNumber?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  distance?: number;
  duration?: number;
  averageSpeed?: number;
  maxSpeed?: number;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      try {
        const vehicleResponse = await fetch(
          "http://localhost:5001/api/vehicles?limit=100"
        );

        if (!vehicleResponse.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const vehicleResult = await vehicleResponse.json();

        if (!vehicleResult.success) {
          throw new Error("Failed to fetch vehicles");
        }

        const vehicles: Vehicle[] =
          vehicleResult.data.vehicles;

        const tripResults = await Promise.all(
          vehicles.map(async (vehicle) => {
            const response = await fetch(
              `http://localhost:5001/api/vehicles/${vehicle._id}/trips?limit=20`
            );

            if (!response.ok) {
              return [];
            }

            const result = await response.json();

            if (!result.success) {
              return [];
            }

            return (result.data || []).map((trip: Trip) => ({
              ...trip,
              vehicleNumber: vehicle.vehicleNumber,
            }));
          })
        );

        setTrips(tripResults.flat());
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return (
    <div className="min-h-full overflow-auto bg-[#020b12] p-5 text-white">
      <div className="mx-auto max-w-[1800px]">
        {/* HEADER */}
        <div className="mb-5">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            FLEET COMMAND // 04
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Trips
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Fleet trip activity
          </p>
        </div>

        {/* TRIP PANEL */}
        <div className="overflow-hidden rounded-xl border border-[#12384a] bg-[#03111c]">
          <div className="border-b border-[#12384a] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                  TRIP ACTIVITY
                </p>

                <p className="mt-1 text-xs text-[#58717e]">
                  RECENT FLEET TRIPS
                </p>
              </div>

              <span className="rounded-md border border-[#12384a] px-2 py-1 font-mono text-[9px] text-[#58717e]">
                {trips.length} LOADED
              </span>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-32 items-center justify-center">
              <span className="text-[10px] text-[#58717e]">
                LOADING TRIPS...
              </span>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="border-b border-red/20 bg-red/5 px-4 py-3">
              <p className="text-[10px] text-red">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            trips.length === 0 && (
              <div className="flex min-h-32 items-center justify-center">
                <span className="text-[10px] text-[#58717e]">
                  NO TRIPS FOUND
                </span>
              </div>
            )}

          {/* TRIPS */}
          {!loading &&
            !error &&
            trips.map((trip) => (
              <div
                key={trip._id}
                className="border-b border-[#0d2b3a] px-5 py-4 transition hover:bg-[#061d2b]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-bold text-white">
                      {trip.vehicleNumber ||
                        trip.vehicleId}
                    </p>

                    <p className="mt-1 text-[9px] text-[#6f8c9b]">
                      {trip.startTime
                        ? new Date(
                            trip.startTime
                          ).toLocaleString()
                        : "NO START TIME"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold text-green">
                      {trip.status || "UNKNOWN"}
                    </p>

                    <p className="mt-1 text-[9px] text-[#58717e]">
                      {trip.distance ?? 0} km
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-6">
                  <div>
                    <p className="text-[8px] text-[#45616e]">
                      AVG SPEED
                    </p>

                    <p className="mt-1 text-[10px] text-[#8ca6b4]">
                      {trip.averageSpeed ?? 0} km/h
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] text-[#45616e]">
                      MAX SPEED
                    </p>

                    <p className="mt-1 text-[10px] text-[#8ca6b4]">
                      {trip.maxSpeed ?? 0} km/h
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] text-[#45616e]">
                      DURATION
                    </p>

                    <p className="mt-1 text-[10px] text-[#8ca6b4]">
                      {trip.duration
                        ? Math.round(
                            trip.duration / 60
                          )
                        : 0}{" "}
                      min
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}