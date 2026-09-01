"use client";

import { useEffect, useState } from "react";

interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch(
          "http://localhost:5001/api/drivers"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.error?.message || "Failed to fetch drivers"
          );
        }

        setDrivers(result.data);
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

    fetchDrivers();
  }, []);

  return (
    <div className="min-h-full bg-[#020b12] p-5 text-white">
      <div className="mx-auto max-w-[1800px]">
        <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
          FLEET COMMAND // 02
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          Drivers
        </h1>

        <p className="mt-1 text-xs text-[#58717e]">
          Driver management and status
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#12384a] bg-[#03111c]">
          <div className="border-b border-[#12384a] p-4">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-cyan">
              DRIVER ROSTER
            </span>
          </div>

          {loading && (
            <div className="p-6 text-xs text-[#58717e]">
              LOADING DRIVERS...
            </div>
          )}

          {error && (
            <div className="p-6 text-xs text-red">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div>
              {drivers.map((driver) => (
                <div
                  key={driver._id}
                  className="flex items-center justify-between border-b border-[#0d2b3a] px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {driver.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#58717e]">
                      {driver.licenseNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#8ca6b4]">
                      {driver.phone}
                    </p>

                    <p
                      className={`mt-1 text-[9px] font-bold ${
                        driver.status === "ACTIVE"
                          ? "text-green"
                          : "text-red"
                      }`}
                    >
                      {driver.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}