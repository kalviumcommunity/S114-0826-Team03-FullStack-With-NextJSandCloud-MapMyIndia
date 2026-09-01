"use client";

import { useEffect, useState } from "react";
import type {
  Vehicle,
  VehicleListApiResponse,
  VehicleStatus,
} from "../../types/vehicle";

const API_URL = "http://localhost:5001/api/vehicles";

export default function LiveMap({
  onVehicleSelect,
}: {
  onVehicleSelect?: (vehicle: Vehicle) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [selectedVehicle, setSelectedVehicle] =
    useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const response = await fetch(
          `${API_URL}?limit=100`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const result: VehicleListApiResponse =
          await response.json();

        if (!result.success || !result.data) {
          throw new Error("Failed to fetch vehicles");
        }

        const normalizedVehicles: Vehicle[] =
          result.data.vehicles.map((vehicle: any) => ({
            ...vehicle,
            id: vehicle._id,
            driverId:
              typeof vehicle.driverId === "object"
                ? vehicle.driverId?._id
                : vehicle.driverId,
            driverName:
              typeof vehicle.driverId === "object"
                ? vehicle.driverId?.name
                : undefined,
            fuel: vehicle.fuel ?? 0,
          }));

        setVehicles(normalizedVehicles);
      } catch (error) {
        console.error(
          "LiveMap vehicle fetch failed:",
          error
        );
      }
    }

    loadVehicles();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) => {
          if (vehicle.status !== "MOVING") {
            return vehicle;
          }

          return {
            ...vehicle,
            latitude:
              vehicle.latitude + 0.00015,
            longitude:
              vehicle.longitude + 0.0001,
            lastUpdated:
              new Date().toISOString(),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function handleVehicleClick(vehicle: Vehicle) {
    setSelectedVehicle(vehicle.id);
    onVehicleSelect?.(vehicle);
  }

  return (
    <section className="map-panel relative min-h-[520px] overflow-hidden rounded-xl">
      {/* MAP */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
        }}
      >
        {/* BASE */}
        <div className="absolute inset-0 bg-[#06141e]" />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(43,193,226,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,193,226,0.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* WATER / PARK AREAS */}
        <div className="absolute -left-20 top-[5%] h-[28%] w-[42%] rotate-[18deg] rounded-[45%] bg-[#062331] opacity-70" />

        <div className="absolute bottom-[5%] right-[-10%] h-[32%] w-[35%] rotate-[-15deg] rounded-[50%] bg-[#072736] opacity-60" />

        <div className="absolute left-[28%] top-[36%] h-[18%] w-[22%] rounded-[45%] bg-[#09251f] opacity-60" />

        {/* MAJOR ROADS */}
        <Road
          left="3%"
          top="28%"
          width="95%"
          rotate="8deg"
          major
        />

        <Road
          left="-5%"
          top="55%"
          width="110%"
          rotate="-7deg"
          major
        />

        <Road
          left="5%"
          top="76%"
          width="90%"
          rotate="3deg"
          major
        />

        <Road
          left="18%"
          top="-10%"
          width="120%"
          rotate="76deg"
          major
        />

        <Road
          left="55%"
          top="-10%"
          width="120%"
          rotate="102deg"
          major
        />

        {/* SECONDARY ROADS */}
        <Road
          left="0%"
          top="18%"
          width="65%"
          rotate="25deg"
        />

        <Road
          left="25%"
          top="42%"
          width="75%"
          rotate="-22deg"
        />

        <Road
          left="15%"
          top="68%"
          width="75%"
          rotate="-32deg"
        />

        <Road
          left="42%"
          top="10%"
          width="80%"
          rotate="65deg"
        />

        <Road
          left="68%"
          top="20%"
          width="70%"
          rotate="110deg"
        />

        <Road
          left="5%"
          top="88%"
          width="65%"
          rotate="18deg"
        />

        {/* CITY BLOCKS */}
        <div className="absolute left-[8%] top-[36%] h-[12%] w-[18%] border border-[#123542] opacity-50" />

        <div className="absolute left-[32%] top-[18%] h-[13%] w-[16%] border border-[#123542] opacity-40" />

        <div className="absolute left-[50%] top-[55%] h-[14%] w-[19%] border border-[#123542] opacity-40" />

        <div className="absolute right-[8%] top-[32%] h-[13%] w-[16%] border border-[#123542] opacity-40" />

        <div className="absolute bottom-[8%] left-[30%] h-[12%] w-[18%] border border-[#123542] opacity-40" />

        {/* LABELS */}
        <MapLabel
          left="13%"
          top="20%"
          text="CENTRAL DELHI"
        />

        <MapLabel
          left="60%"
          top="30%"
          text="NEW DELHI"
        />

        <MapLabel
          left="21%"
          top="64%"
          text="LODHI ROAD"
        />

        <MapLabel
          left="72%"
          top="65%"
          text="SOUTH DELHI"
        />

        <MapLabel
          left="43%"
          top="82%"
          text="GREATER KAILASH"
        />

        {/* VEHICLES */}
        {vehicles.map((vehicle) => (
          <MapVehicle
            key={vehicle.id}
            vehicle={vehicle}
            selected={
              selectedVehicle === vehicle.id
            }
            onClick={() =>
              handleVehicleClick(vehicle)
            }
          />
        ))}
      </div>

      {/* SCAN LINES */}
      <div className="scan-lines pointer-events-none absolute inset-0 z-[2] opacity-20" />

      {/* HEADER */}
      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between">
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

      {/* ZOOM CONTROLS */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col overflow-hidden rounded-lg border border-[#12384a] bg-[#03111c]/95">
        <button
          type="button"
          onClick={() =>
            setZoom((current) =>
              Math.min(
                current + 0.15,
                1.6
              )
            )
          }
          className="flex h-9 w-9 items-center justify-center border-b border-[#12384a] text-[#9db5c2] hover:bg-[#0a1d2b] hover:text-cyan"
        >
          +
        </button>

        <button
          type="button"
          onClick={() =>
            setZoom((current) =>
              Math.max(
                current - 0.15,
                0.8
              )
            )
          }
          className="flex h-9 w-9 items-center justify-center text-[#9db5c2] hover:bg-[#0a1d2b] hover:text-cyan"
        >
          −
        </button>
      </div>

      {/* LEGEND */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-[#12384a] bg-[#03111c]/90 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-4">
          <LegendItem
            status="MOVING"
            label="MOVING"
          />

          <LegendItem
            status="IDLE"
            label="IDLE"
          />

          <LegendItem
            status="STOPPED"
            label="STOPPED"
          />

          <LegendItem
            status="OFFLINE"
            label="OFFLINE"
          />
        </div>
      </div>

      {/* COORDINATES */}
      <div className="absolute bottom-4 right-4 z-20 rounded-lg border border-[#12384a] bg-[#03111c]/90 px-3 py-2 backdrop-blur">
        <p className="font-mono text-[9px] text-[#58717e]">
          LAT 12.9716
        </p>

        <p className="font-mono text-[9px] text-[#58717e]">
          LNG 77.5946
        </p>
      </div>
    </section>
  );
}

function Road({
  left,
  top,
  width,
  rotate,
  major = false,
}: {
  left: string;
  top: string;
  width: string;
  rotate: string;
  major?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-full ${
        major
          ? "h-[3px] bg-[#214451]"
          : "h-[1px] bg-[#153440]"
      }`}
      style={{
        left,
        top,
        width,
        transform: `rotate(${rotate})`,
        transformOrigin:
          "left center",
      }}
    >
      {major && (
        <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-[#315b67] opacity-40" />
      )}
    </div>
  );
}

function MapLabel({
  left,
  top,
  text,
}: {
  left: string;
  top: string;
  text: string;
}) {
  return (
    <div
      className="absolute text-[8px] font-semibold tracking-[0.15em] text-[#365866] opacity-70"
      style={{
        left,
        top,
      }}
    >
      {text}
    </div>
  );
}

function MapVehicle({
  vehicle,
  selected,
  onClick,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onClick: () => void;
}) {
  const left =
    ((vehicle.longitude - 77.4) /
      0.4) *
    100;

  const top =
    ((13.25 - vehicle.latitude) /
      0.5) *
    100;

  const statusClass =
    vehicle.status === "MOVING"
      ? "status-moving"
      : vehicle.status === "IDLE"
        ? "status-idle"
        : vehicle.status === "STOPPED"
          ? "status-stopped"
          : "status-offline";

  const statusTextClass =
    vehicle.status === "MOVING"
      ? "text-green"
      : vehicle.status === "IDLE"
        ? "text-yellow"
        : vehicle.status === "STOPPED"
          ? "text-red"
          : "text-[#7894a3]";

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${Math.max(
          5,
          Math.min(95, left)
        )}%`,
        top: `${Math.max(
          8,
          Math.min(92, top)
        )}%`,
      }}
    >
      {vehicle.status === "MOVING" && (
        <span
          className={`absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-20 ${statusClass}`}
        />
      )}

      <span
        className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#03111c] ${statusClass} ${
          selected
            ? "scale-125 ring-2 ring-cyan/60"
            : ""
        } transition-transform`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white opacity-80" />
      </span>

      <span
        className={`absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded border ${
          selected
            ? "border-cyan/50"
            : "border-[#164052]"
        } bg-[#03111c]/95 px-2 py-1 font-mono text-[8px] text-[#9db5c2] shadow-lg`}
      >
        {vehicle.vehicleNumber}

        {selected && (
          <span
            className={`ml-2 ${statusTextClass}`}
          >
            {vehicle.speed} km/h
          </span>
        )}
      </span>
    </button>
  );
}

function LegendItem({
  status,
  label,
}: {
  status: VehicleStatus;
  label: string;
}) {
  const statusClass =
    status === "MOVING"
      ? "status-moving"
      : status === "IDLE"
        ? "status-idle"
        : status === "STOPPED"
          ? "status-stopped"
          : "status-offline";

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`status-dot h-1.5 w-1.5 ${statusClass}`}
      />

      <span className="text-[8px] font-semibold text-[#7894a3]">
        {label}
      </span>
    </div>
  );
}