"use client";

import type { Vehicle } from "../../types/vehicle";

interface VehicleDetailsProps {
  vehicle?: Vehicle;
}

export default function VehicleDetails({
  vehicle,
}: VehicleDetailsProps) {
  if (!vehicle) {
    return (
      <section className="map-panel flex min-h-[520px] items-center justify-center rounded-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#12384a] bg-[#061521] text-xl text-cyan">
            ⌖
          </div>

          <p className="text-sm font-semibold text-white">
            No Vehicle Selected
          </p>

          <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#58717e]">
            Select a vehicle from the map or roster to view
            live telemetry.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="map-panel min-h-[520px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="border-b border-[#12384a] p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
              SELECTED VEHICLE
            </p>

            <h2 className="mt-1 font-mono text-lg font-bold text-white">
              {vehicle.vehicleNumber}
            </h2>
          </div>

          <span
            className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-bold ${
              vehicle.status === "MOVING"
                ? "border-green/30 bg-green/10 text-green"
                : vehicle.status === "IDLE"
                  ? "border-yellow/30 bg-yellow/10 text-yellow"
                  : vehicle.status === "STOPPED"
                    ? "border-red/30 bg-red/10 text-red"
                    : "border-[#34515f] bg-[#34515f]/10 text-[#7894a3]"
            }`}
          >
            <span
              className={`status-dot ${
                vehicle.status === "MOVING"
                  ? "status-moving"
                  : vehicle.status === "IDLE"
                    ? "status-idle"
                    : vehicle.status === "STOPPED"
                      ? "status-stopped"
                      : "status-offline"
              }`}
            />

            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Driver */}
      <div className="border-b border-[#12384a] p-4">
        <p className="mb-3 text-[9px] font-semibold tracking-[0.16em] text-[#58717e]">
          DRIVER
        </p>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-sm font-bold text-cyan">
            {vehicle.driverName
              ? vehicle.driverName
                  .split(" ")
                  .map((name) => name[0])
                  .slice(0, 2)
                  .join("")
              : "—"}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {vehicle.driverName || "Unassigned"}
            </p>

            <p className="mt-0.5 text-[10px] text-[#58717e]">
              Assigned Driver
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="border-b border-[#12384a] p-4">
        <p className="mb-3 text-[9px] font-semibold tracking-[0.16em] text-[#58717e]">
          LIVE TELEMETRY
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Telemetry
            label="SPEED"
            value={`${vehicle.speed}`}
            unit="km/h"
          />

          <Telemetry
            label="FUEL"
            value={`${vehicle.fuel}`}
            unit="%"
          />

          <Telemetry
            label="HEADING"
            value={`${vehicle.heading}`}
            unit="°"
          />

          <Telemetry
            label="STATUS"
            value={vehicle.status}
            unit=""
          />
        </div>
      </div>

      {/* Location */}
      <div className="border-b border-[#12384a] p-4">
        <p className="mb-3 text-[9px] font-semibold tracking-[0.16em] text-[#58717e]">
          CURRENT LOCATION
        </p>

        <div className="rounded-lg border border-[#12384a] bg-[#03111c] p-3">
          <p className="font-mono text-xs text-cyan">
            {vehicle.latitude.toFixed(6)}
          </p>

          <p className="mt-1 font-mono text-xs text-cyan">
            {vehicle.longitude.toFixed(6)}
          </p>
        </div>
      </div>

      {/* Last update */}
      <div className="flex items-center justify-between p-4">
        <span className="text-[9px] tracking-[0.12em] text-[#58717e]">
          LAST UPDATED
        </span>

        <span className="font-mono text-[9px] text-[#7894a3]">
          {new Date(vehicle.lastUpdated).toLocaleTimeString()}
        </span>
      </div>
    </section>
  );
}

function Telemetry({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-lg border border-[#12384a] bg-[#03111c] p-3">
      <p className="text-[8px] font-semibold tracking-[0.12em] text-[#58717e]">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono text-sm font-bold text-white">
          {value}
        </span>

        {unit && (
          <span className="text-[8px] text-[#58717e]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}