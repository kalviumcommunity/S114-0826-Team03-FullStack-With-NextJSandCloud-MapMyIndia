"use client";

export default function LiveMap() {
  return (
    <section className="map-panel relative min-h-[520px] overflow-hidden rounded-xl">
      {/* Map background */}
      <div className="map-grid absolute inset-0" />

      {/* Scan lines */}
      <div className="scan-lines pointer-events-none absolute inset-0 opacity-40" />

      {/* Header */}
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan">
            LIVE FLEET MAP
          </p>

          <p className="mt-1 text-xs text-[#6f8c9b]">
            NEW DELHI METROPOLITAN AREA
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#12384a] bg-[#03111c]/90 px-3 py-2 backdrop-blur">
          <span className="status-dot status-moving" />

          <span className="text-[10px] font-semibold text-green">
            LIVE
          </span>
        </div>
      </div>

      {/* Fake road network */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[15%] top-[10%] h-[1px] w-[70%] rotate-[18deg] bg-cyan/30" />
        <div className="absolute left-[5%] top-[40%] h-[1px] w-[90%] -rotate-[12deg] bg-cyan/25" />
        <div className="absolute left-[20%] top-[70%] h-[1px] w-[65%] rotate-[8deg] bg-cyan/25" />
        <div className="absolute left-[45%] top-[5%] h-[90%] w-[1px] rotate-[14deg] bg-cyan/20" />
        <div className="absolute left-[70%] top-[10%] h-[85%] w-[1px] -rotate-[20deg] bg-cyan/20" />
      </div>

      {/* Vehicle markers */}
      <VehicleMarker
        left="28%"
        top="32%"
        label="MH-12-AX-4821"
        status="MOVING"
      />

      <VehicleMarker
        left="57%"
        top="25%"
        label="DL-04-KB-7742"
        status="MOVING"
      />

      <VehicleMarker
        left="72%"
        top="48%"
        label="KA-01-MN-9012"
        status="IDLE"
      />

      <VehicleMarker
        left="42%"
        top="62%"
        label="DL-09-CQ-1820"
        status="STOPPED"
      />

      <VehicleMarker
        left="78%"
        top="72%"
        label="HR-26-ZX-5521"
        status="MOVING"
      />

      {/* Map controls */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col overflow-hidden rounded-lg border border-[#12384a] bg-[#03111c]/95">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center border-b border-[#12384a] text-[#9db5c2] hover:bg-[#0a1d2b] hover:text-cyan"
        >
          +
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center text-[#9db5c2] hover:bg-[#0a1d2b] hover:text-cyan"
        >
          −
        </button>
      </div>

      {/* Coordinates */}
      <div className="absolute bottom-4 right-4 z-10 rounded-lg border border-[#12384a] bg-[#03111c]/90 px-3 py-2">
        <p className="font-mono text-[9px] text-[#58717e]">
          LAT 28.6139
        </p>

        <p className="font-mono text-[9px] text-[#58717e]">
          LNG 77.2090
        </p>
      </div>
    </section>
  );
}

function VehicleMarker({
  left,
  top,
  label,
  status,
}: {
  left: string;
  top: string;
  label: string;
  status: "MOVING" | "IDLE" | "STOPPED";
}) {
  const statusClass =
    status === "MOVING"
      ? "status-moving"
      : status === "IDLE"
        ? "status-idle"
        : "status-stopped";

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={`absolute h-7 w-7 animate-ping rounded-full opacity-20 ${statusClass}`}
        />

        <span
          className={`status-dot relative h-3 w-3 ${statusClass}`}
        />
      </div>

      <div className="mt-2 whitespace-nowrap rounded border border-[#164052] bg-[#03111c]/90 px-2 py-1 text-[8px] font-mono text-[#9db5c2] backdrop-blur">
        {label}
      </div>
    </div>
  );
}