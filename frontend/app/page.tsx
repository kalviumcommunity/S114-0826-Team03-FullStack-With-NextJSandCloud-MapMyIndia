"use client";

import { useState } from "react";

import FleetStats from "../components/dashboard/FleetStats";
import LiveMap from "../components/dashboard/LiveMap";
import VehicleDetails from "../components/dashboard/VehicleDetails";
import VehicleRoster from "../components/dashboard/VehicleRoster";

import type { Vehicle } from "../types/vehicle";

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | undefined>(undefined);

  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1800px] p-4 lg:p-5">
        {/* Page heading */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
              FLEET COMMAND // 01
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Fleet Dashboard
            </h1>

            <p className="mt-1 text-xs text-[#58717e]">
              Real-time operational overview
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2 md:flex">
            <span className="status-dot status-moving" />

            <span className="text-[10px] font-semibold tracking-[0.12em] text-green">
              SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

        {/* Fleet stats */}
        <FleetStats />

        {/* Main dashboard */}
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left side */}
          <div className="min-w-0 space-y-4">
            <LiveMap />

            <div className="h-[520px]">
              <VehicleRoster
                onVehicleSelect={setSelectedVehicle}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="min-w-0">
            <VehicleDetails
              vehicle={selectedVehicle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}