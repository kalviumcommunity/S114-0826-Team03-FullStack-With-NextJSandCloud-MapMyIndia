"use client";

import LiveMap from "../../components/dashboard/LiveMap";

export default function TrackingPage() {
  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1800px] p-4 lg:p-5">
        <div className="mb-5">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            LIVE TRACKING // 02
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Live Tracking
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Real-time vehicle locations
          </p>
        </div>

        <div className="h-[calc(100vh-150px)] min-h-[500px]">
          <LiveMap />
        </div>
      </div>
    </div>
  );
}