"use client";

import { useEffect, useState } from "react";

interface VehicleStats {
  total: number;
  moving: number;
  idle: number;
  stopped: number;
  offline: number;
}

const API_URL = "http://localhost:5001/api/vehicles/stats";

export default function FleetStats() {
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch fleet statistics");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error(
            result.message ||
              "Failed to fetch fleet statistics"
          );
        }

        setStats(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "TOTAL VEHICLES",
      value: stats?.total ?? 0,
      detail: "FLEET SIZE",
      accent: "text-cyan",
      dot: "bg-cyan",
    },
    {
      label: "MOVING",
      value: stats?.moving ?? 0,
      detail: stats
        ? `${((stats.moving / stats.total) * 100).toFixed(1)}% OF FLEET`
        : "—",
      accent: "text-green",
      dot: "bg-green",
    },
    {
      label: "IDLE",
      value: stats?.idle ?? 0,
      detail: stats
        ? `${((stats.idle / stats.total) * 100).toFixed(1)}% OF FLEET`
        : "—",
      accent: "text-yellow",
      dot: "bg-yellow",
    },
    {
      label: "STOPPED",
      value: stats?.stopped ?? 0,
      detail: stats
        ? `${((stats.stopped / stats.total) * 100).toFixed(1)}% OF FLEET`
        : "—",
      accent: "text-red",
      dot: "bg-red",
    },
    {
      label: "OFFLINE",
      value: stats?.offline ?? 0,
      detail: stats
        ? `${((stats.offline / stats.total) * 100).toFixed(1)}% OF FLEET`
        : "—",
      accent: "text-[#7894a3]",
      dot: "bg-[#7894a3]",
    },
  ];

  if (error) {
    return (
      <section className="rounded-xl border border-red/30 bg-red/5 p-4 text-sm text-red">
        {error}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="map-panel relative overflow-hidden rounded-xl p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${stat.dot}`}
            />

            <span className="text-[10px] font-semibold tracking-[0.16em] text-[#6f8c9b]">
              {stat.label}
            </span>
          </div>

          <div
            className={`font-mono text-2xl font-bold ${stat.accent}`}
          >
            {loading ? "—" : stat.value.toLocaleString()}
          </div>

          <div className="mt-1 text-[9px] tracking-[0.1em] text-[#58717e]">
            {loading ? "LOADING..." : stat.detail}
          </div>
        </div>
      ))}
    </section>
  );
}