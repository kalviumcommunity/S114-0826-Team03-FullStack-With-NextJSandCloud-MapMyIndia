"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Vehicle,
  VehicleListApiResponse,
  VehicleStatus,
} from "../../types/vehicle";

const API_URL = "http://localhost:5001/api/vehicles";

const statuses: Array<VehicleStatus | "ALL"> = [
  "ALL",
  "MOVING",
  "IDLE",
  "STOPPED",
  "OFFLINE",
];

interface VehicleRosterProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export default function VehicleRoster({
  onVehicleSelect,
}: VehicleRosterProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    VehicleStatus | "ALL"
  >("ALL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchVehicles = async (
    nextCursor: string | null = null,
    reset = false
  ) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("limit", "20");

      if (nextCursor) {
        params.set("cursor", nextCursor);
      }

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const result: VehicleListApiResponse =
        await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ||
            "Failed to fetch vehicles"
        );
      }

      const newVehicles = result.data.vehicles;

      setVehicles((previous) =>
        reset
          ? newVehicles
          : [...previous, ...newVehicles]
      );

      setCursor(result.data.pagination.nextCursor);
      setHasNextPage(
        result.data.pagination.hasNextPage
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVehicles([]);
    setCursor(null);
    setHasNextPage(true);

    fetchVehicles(null, true);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const element = observerRef.current;

    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasNextPage
        ) {
          fetchVehicles(cursor);
        }
      },
      {
        rootMargin: "250px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [cursor, hasNextPage, loading]);

  return (
    <section className="map-panel flex min-h-0 flex-col overflow-hidden rounded-xl">
      {/* Header */}
      <div className="shrink-0 border-b border-[#12384a] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
              VEHICLE ROSTER
            </p>

            <p className="mt-1 text-xs text-[#58717e]">
              LIVE FLEET STATUS
            </p>
          </div>

          <div className="rounded-md border border-[#12384a] bg-[#03111c] px-2 py-1">
            <span className="font-mono text-[10px] text-[#7894a3]">
              {vehicles.length} LOADED
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search vehicle..."
            className="h-9 w-full rounded-lg border border-[#12384a] bg-[#03111c] px-3 text-xs text-white outline-none placeholder:text-[#58717e] focus:border-cyan"
          />
        </div>

        {/* Filters */}
        <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
          {statuses.map((status) => {
            const active =
              statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setStatusFilter(status)
                }
                className={`shrink-0 rounded-md border px-2.5 py-1.5 text-[9px] font-semibold transition ${
                  active
                    ? "border-cyan/50 bg-cyan/10 text-cyan"
                    : "border-[#12384a] bg-[#03111c] text-[#6f8c9b] hover:border-[#1d5268] hover:text-white"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {error && (
          <div className="m-3 rounded-lg border border-red/30 bg-red/5 p-3 text-xs text-red">
            {error}
          </div>
        )}

        {vehicles.length === 0 &&
          !loading &&
          !error && (
            <div className="flex min-h-40 items-center justify-center px-4 text-center text-xs text-[#58717e]">
              No vehicles found.
            </div>
          )}

        <div>
          {vehicles.map((vehicle) => (
            <VehicleRow
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() =>
                onVehicleSelect?.(vehicle)
              }
            />
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        <div
          ref={observerRef}
          className="flex min-h-16 items-center justify-center"
        >
          {loading && (
            <span className="text-[10px] text-[#58717e]">
              Loading vehicles...
            </span>
          )}

          {!loading &&
            !hasNextPage &&
            vehicles.length > 0 && (
              <span className="text-[10px] text-[#45616e]">
                END OF ROSTER
              </span>
            )}
        </div>
      </div>
    </section>
  );
}

function VehicleRow({
  vehicle,
  onClick,
}: {
  vehicle: Vehicle;
  onClick: () => void;
}) {
  const statusClass =
    vehicle.status === "MOVING"
      ? "status-moving"
      : vehicle.status === "IDLE"
        ? "status-idle"
        : vehicle.status === "STOPPED"
          ? "status-stopped"
          : "status-offline";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-b border-[#0d2b3a] px-4 py-3 text-left transition hover:bg-[#061d2b]"
    >
      {/* Status */}
      <span
        className={`status-dot shrink-0 ${statusClass}`}
      />

      {/* Vehicle */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-xs font-bold text-white">
            {vehicle.vehicleNumber}
          </span>

          <span className="shrink-0 font-mono text-[9px] text-[#58717e]">
            {vehicle.speed} km/h
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-[9px] text-[#6f8c9b]">
            {vehicle.driverName ||
              "UNASSIGNED"}
          </span>

          <span
            className={`text-[8px] font-bold ${
              vehicle.status === "MOVING"
                ? "text-green"
                : vehicle.status === "IDLE"
                  ? "text-yellow"
                  : vehicle.status === "STOPPED"
                    ? "text-red"
                    : "text-[#7894a3]"
            }`}
          >
            {vehicle.status}
          </span>
        </div>
      </div>

      <span className="text-xs text-[#45616e] transition group-hover:text-cyan">
        →
      </span>
    </button>
  );
}