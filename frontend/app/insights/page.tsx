"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  vehicleNumber: string;
  status: "MOVING" | "IDLE" | "STOPPED" | "OFFLINE";
  fuel: number;
  speed: number;
}

interface Maintenance {
  _id: string;
  cost: number;
  status: string;
}

export default function InsightsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenance, setMaintenance] = useState<
    Maintenance[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehiclesRes, maintenanceRes] =
          await Promise.all([
            fetch(
              "http://localhost:5001/api/vehicles?limit=100"
            ),
            fetch(
              "http://localhost:5001/api/maintenance"
            ),
          ]);

        const vehiclesData =
          await vehiclesRes.json();

        const maintenanceData =
          await maintenanceRes.json();

        setVehicles(
          vehiclesData.data?.vehicles || []
        );

        setMaintenance(
          maintenanceData.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load insights",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalVehicles = vehicles.length;

  const moving = vehicles.filter(
    (v) => v.status === "MOVING"
  ).length;

  const idle = vehicles.filter(
    (v) => v.status === "IDLE"
  ).length;

  const stopped = vehicles.filter(
    (v) => v.status === "STOPPED"
  ).length;

  const offline = vehicles.filter(
    (v) => v.status === "OFFLINE"
  ).length;

  const averageFuel =
    vehicles.length > 0
      ? vehicles.reduce(
          (sum, vehicle) =>
            sum + vehicle.fuel,
          0
        ) / vehicles.length
      : 0;

  const averageSpeed =
    vehicles.length > 0
      ? vehicles.reduce(
          (sum, vehicle) =>
            sum + vehicle.speed,
          0
        ) / vehicles.length
      : 0;

  const totalMaintenanceCost =
    maintenance.reduce(
      (sum, item) => sum + item.cost,
      0
    );

  const maintenanceDue =
    maintenance.filter(
      (item) =>
        item.status === "SCHEDULED"
    ).length;

  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1200px] p-4 lg:p-5">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            INSIGHTS // 08
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Fleet Insights
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Operational patterns from your fleet data
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-5">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              FLEET SIZE
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {loading ? "--" : totalVehicles}
            </p>

            <p className="mt-1 text-[9px] text-[#58717e]">
              registered vehicles
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-5">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              AVG FUEL
            </p>

            <p className="mt-2 text-2xl font-bold text-green">
              {loading
                ? "--"
                : `${averageFuel.toFixed(1)}%`}
            </p>

            <p className="mt-1 text-[9px] text-[#58717e]">
              fleet average
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-5">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              AVG SPEED
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan">
              {loading
                ? "--"
                : `${averageSpeed.toFixed(1)}`}
            </p>

            <p className="mt-1 text-[9px] text-[#58717e]">
              km/h across fleet
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-5">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              MAINTENANCE
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow">
              {loading ? "--" : maintenanceDue}
            </p>

            <p className="mt-1 text-[9px] text-[#58717e]">
              scheduled jobs
            </p>
          </div>

        </div>

        {/* Fleet distribution */}
        <div className="mt-5 rounded-xl border border-[#12384a] bg-[#03111c]">

          <div className="border-b border-[#12384a] px-5 py-4">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
              FLEET DISTRIBUTION
            </p>

            <p className="mt-1 text-[10px] text-[#58717e]">
              Current operational status
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#12384a] md:grid-cols-4">

            {[
              {
                label: "MOVING",
                value: moving,
              },
              {
                label: "IDLE",
                value: idle,
              },
              {
                label: "STOPPED",
                value: stopped,
              },
              {
                label: "OFFLINE",
                value: offline,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#03111c] p-5"
              >
                <p className="text-[9px] tracking-wider text-[#58717e]">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {loading ? "--" : item.value}
                </p>

                {!loading && totalVehicles > 0 && (
                  <p className="mt-1 text-[9px] text-[#58717e]">
                    {(
                      (item.value /
                        totalVehicles) *
                      100
                    ).toFixed(0)}
                    % of fleet
                  </p>
                )}
              </div>
            ))}

          </div>
        </div>

        {/* Operational insights */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">

          <div className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                OPERATIONAL INSIGHTS
              </p>
            </div>

            <div className="space-y-4 p-5">

              <div className="flex items-start gap-3">
                <span className="mt-1 text-cyan">
                  ◈
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Fleet activity
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#718c9b]">
                    {moving} of {totalVehicles} vehicles
                    are currently moving.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-yellow">
                  ◈
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Maintenance attention
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#718c9b]">
                    {maintenanceDue} maintenance{" "}
                    {maintenanceDue === 1
                      ? "job is"
                      : "jobs are"}{" "}
                    currently scheduled.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-green">
                  ◈
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Fuel efficiency
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#718c9b]">
                    Fleet average fuel level is{" "}
                    {averageFuel.toFixed(1)}%.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Cost overview */}
          <div className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                COST OVERVIEW
              </p>
            </div>

            <div className="p-5">

              <p className="text-[9px] tracking-wider text-[#58717e]">
                TOTAL MAINTENANCE COST
              </p>

              <p className="mt-2 text-3xl font-bold text-green">
                ₹
                {totalMaintenanceCost.toLocaleString(
                  "en-IN"
                )}
              </p>

              <div className="mt-5 h-px bg-[#12384a]" />

              <div className="mt-4 flex justify-between">
                <span className="text-[10px] text-[#58717e]">
                  Maintenance records
                </span>

                <span className="text-xs font-semibold text-white">
                  {maintenance.length}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-[10px] text-[#58717e]">
                  Scheduled
                </span>

                <span className="text-xs font-semibold text-yellow">
                  {maintenanceDue}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}