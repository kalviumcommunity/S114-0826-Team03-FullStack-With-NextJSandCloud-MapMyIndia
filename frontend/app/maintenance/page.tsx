"use client";

import { useEffect, useState } from "react";

interface Maintenance {
  _id: string;
  vehicleId:
    | {
        _id: string;
        vehicleNumber: string;
        status: string;
      }
    | string;
  type: "SERVICE" | "REPAIR" | "INSPECTION" | "TYRE" | "OTHER";
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  status:
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
}

export default function MaintenancePage() {
  const [records, setRecords] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5001/api/maintenance"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch maintenance records"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          "Failed to fetch maintenance records"
        );
      }

      setRecords(result.data || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const getVehicleNumber = (
    vehicleId: Maintenance["vehicleId"]
  ) => {
    if (typeof vehicleId === "string") {
      return vehicleId;
    }

    return vehicleId.vehicleNumber;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(cost);
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "border-green/30 bg-green/10 text-green";

      case "IN_PROGRESS":
        return "border-cyan/30 bg-cyan/10 text-cyan";

      case "CANCELLED":
        return "border-red/30 bg-red/10 text-red";

      default:
        return "border-yellow/30 bg-yellow/10 text-yellow";
    }
  };

  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1200px] p-4 lg:p-5">

        {/* HEADER */}
        <div className="mb-5">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            MAINTENANCE // 06
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Maintenance
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Vehicle service and maintenance records
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              TOTAL
            </p>

            <p className="mt-1 text-xl font-bold text-white">
              {records.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              SCHEDULED
            </p>

            <p className="mt-1 text-xl font-bold text-yellow">
              {
                records.filter(
                  (item) =>
                    item.status === "SCHEDULED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              IN PROGRESS
            </p>

            <p className="mt-1 text-xl font-bold text-cyan">
              {
                records.filter(
                  (item) =>
                    item.status === "IN_PROGRESS"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-[#12384a] bg-[#03111c] p-4">
            <p className="text-[9px] tracking-wider text-[#58717e]">
              COMPLETED
            </p>

            <p className="mt-1 text-xl font-bold text-green">
              {
                records.filter(
                  (item) =>
                    item.status === "COMPLETED"
                ).length
              }
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-[#12384a] bg-[#03111c]">

          <div className="border-b border-[#12384a] px-4 py-3">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
              MAINTENANCE LOG
            </p>

            <p className="mt-1 text-[10px] text-[#58717e]">
              Scheduled and completed vehicle work
            </p>
          </div>

          {loading && (
            <div className="flex min-h-40 items-center justify-center">
              <p className="text-[10px] tracking-wider text-[#58717e]">
                LOADING MAINTENANCE...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="p-5">
              <p className="text-xs text-red">
                {error}
              </p>

              <button
                onClick={fetchMaintenance}
                className="mt-3 rounded-lg border border-[#12384a] px-3 py-2 text-[10px] text-[#8ca6b4] hover:bg-[#0a1d2b] hover:text-white"
              >
                RETRY
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            records.length === 0 && (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-xs text-[#58717e]">
                  No maintenance records found.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            records.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#12384a] text-left">
                      <th className="px-5 py-3 text-[9px] font-semibold tracking-wider text-[#58717e]">
                        VEHICLE
                      </th>

                      <th className="px-5 py-3 text-[9px] font-semibold tracking-wider text-[#58717e]">
                        TYPE
                      </th>

                      <th className="px-5 py-3 text-[9px] font-semibold tracking-wider text-[#58717e]">
                        DESCRIPTION
                      </th>

                      <th className="px-5 py-3 text-[9px] font-semibold tracking-wider text-[#58717e]">
                        SCHEDULED
                      </th>

                      <th className="px-5 py-3 text-[9px] font-semibold tracking-wider text-[#58717e]">
                        COST
                      </th>

                      <th className="px-5 py-3 text-[9px] font-semibold tracking-wider text-[#58717e]">
                        STATUS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b border-[#0d2b3a] transition hover:bg-[#061d2b]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-mono text-xs font-semibold text-white">
                            {getVehicleNumber(
                              record.vehicleId
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-[10px] font-semibold text-cyan">
                            {record.type}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-xs text-[#b4c8d2]">
                            {record.description}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-[10px] text-[#8ca6b4]">
                            {formatDate(
                              record.scheduledDate
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-xs font-semibold text-white">
                            {formatCost(record.cost)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-2 py-1 text-[8px] font-bold ${statusClass(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}