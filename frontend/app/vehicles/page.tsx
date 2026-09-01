"use client";

import VehicleRoster from "../../components/dashboard/VehicleRoster";

export default function VehiclesPage() {
  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1200px] p-4 lg:p-5">
        <div className="mb-5">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            VEHICLES // 03
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Vehicles
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Fleet vehicle directory
          </p>
        </div>

        <div className="h-[calc(100vh-150px)] min-h-[500px]">
          <VehicleRoster />
        </div>
      </div>
    </div>
  );
}