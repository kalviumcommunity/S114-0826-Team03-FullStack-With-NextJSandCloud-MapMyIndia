"use client";

import { useEffect, useState } from "react";

interface Geofence {
  _id: string;
  name: string;
  type: "CIRCLE" | "POLYGON";
  status: "ACTIVE" | "INACTIVE";
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export default function GeofencesPage() {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");

  const [creating, setCreating] = useState(false);

  const fetchGeofences = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5001/api/geofences"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch geofences");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to fetch geofences");
      }

      setGeofences(result.data || []);
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
    fetchGeofences();
  }, []);

  const handleCreate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !name ||
      !latitude ||
      !longitude ||
      !radius
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "http://localhost:5001/api/geofences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            type: "CIRCLE",
            latitude: Number(latitude),
            longitude: Number(longitude),
            radius: Number(radius),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create geofence"
        );
      }

      setName("");
      setLatitude("");
      setLongitude("");
      setRadius("");

      setShowCreate(false);

      await fetchGeofences();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create geofence"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1200px] p-4 lg:p-5">

        {/* HEADER */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
              GEOFENCES // 05
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Geofences
            </h1>

            <p className="mt-1 text-xs text-[#58717e]">
              Manage fleet geographic boundaries
            </p>
          </div>

          <div className="rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2">
            <p className="text-[9px] text-[#58717e]">
              TOTAL
            </p>

            <p className="text-lg font-bold text-cyan">
              {geofences.length}
            </p>
          </div>
        </div>

        {/* CREATE FORM */}
        {showCreate && (
          <div className="mb-5 rounded-xl border border-[#12384a] bg-[#03111c] p-5">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                  NEW GEOFENCE
                </p>

                <p className="mt-1 text-[10px] text-[#58717e]">
                  Create a circular monitoring zone
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="text-xs text-[#58717e] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
            >

              {/* NAME */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-[9px] font-semibold tracking-wider text-[#718c9b]">
                  NAME
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. RV University"
                  className="w-full rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#45616e] focus:border-cyan"
                />
              </div>

              {/* LATITUDE */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold tracking-wider text-[#718c9b]">
                  LATITUDE
                </label>

                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) =>
                    setLatitude(e.target.value)
                  }
                  placeholder="12.9352"
                  className="w-full rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#45616e] focus:border-cyan"
                />
              </div>

              {/* LONGITUDE */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold tracking-wider text-[#718c9b]">
                  LONGITUDE
                </label>

                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) =>
                    setLongitude(e.target.value)
                  }
                  placeholder="77.5351"
                  className="w-full rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#45616e] focus:border-cyan"
                />
              </div>

              {/* RADIUS */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold tracking-wider text-[#718c9b]">
                  RADIUS (METERS)
                </label>

                <input
                  type="number"
                  min="1"
                  value={radius}
                  onChange={(e) =>
                    setRadius(e.target.value)
                  }
                  placeholder="500"
                  className="w-full rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#45616e] focus:border-cyan"
                />
              </div>

              {/* SUBMIT */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2.5 text-[10px] font-bold tracking-wider text-cyan transition hover:bg-cyan/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "CREATING..."
                    : "CREATE GEOFENCE"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MAIN PANEL */}
        <div className="rounded-xl border border-[#12384a] bg-[#03111c]">

          {/* PANEL HEADER */}
          <div className="flex items-center justify-between border-b border-[#12384a] px-4 py-3">

            <div>
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                ACTIVE BOUNDARIES
              </p>

              <p className="mt-1 text-[10px] text-[#58717e]">
                Geographic monitoring zones
              </p>
            </div>

            <button
              onClick={() =>
                setShowCreate(!showCreate)
              }
              className="rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-2 text-[10px] font-semibold text-cyan transition hover:bg-cyan/20"
            >
              + CREATE GEOFENCE
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="border-b border-red/20 bg-red/5 px-4 py-3">
              <p className="text-[10px] text-red">
                {error}
              </p>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-40 items-center justify-center">
              <p className="text-[10px] tracking-wider text-[#58717e]">
                LOADING GEOFENCES...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            geofences.length === 0 && (
              <div className="flex min-h-40 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    No geofences
                  </p>

                  <p className="mt-1 text-[10px] text-[#58717e]">
                    Create a geographic boundary to get started.
                  </p>
                </div>
              </div>
            )}

          {/* LIST */}
          {!loading &&
            geofences.map((geofence) => (
              <div
                key={geofence._id}
                className="border-b border-[#0d2b3a] px-5 py-4 transition hover:bg-[#061d2b]"
              >
                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/5 text-lg text-cyan">
                      ⌾
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">
                          {geofence.name}
                        </p>

                        <span className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[8px] font-bold text-green">
                          {geofence.status}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-[#58717e]">
                        {geofence.type === "CIRCLE"
                          ? `Circle • ${
                              geofence.radius ?? 0
                            } m radius`
                          : "Polygon boundary"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {geofence.type === "CIRCLE" && (
                      <>
                        <p className="font-mono text-[10px] text-[#8ca6b4]">
                          {geofence.latitude?.toFixed(4)},{" "}
                          {geofence.longitude?.toFixed(4)}
                        </p>

                        <p className="mt-1 text-[8px] text-[#45616e]">
                          LATITUDE / LONGITUDE
                        </p>
                      </>
                    )}
                  </div>

                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}