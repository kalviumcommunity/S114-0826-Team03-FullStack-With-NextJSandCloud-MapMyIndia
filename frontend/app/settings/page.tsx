"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate, setRefreshRate] = useState("30");

  return (
    <div className="h-full overflow-auto bg-[#020b12]">
      <div className="mx-auto max-w-[1000px] p-4 lg:p-5">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[9px] font-semibold tracking-[0.25em] text-cyan">
            SETTINGS // 09
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Settings
          </h1>

          <p className="mt-1 text-xs text-[#58717e]">
            Configure your fleet dashboard
          </p>
        </div>

        <div className="space-y-5">

          {/* General */}
          <section className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                GENERAL
              </p>

              <p className="mt-1 text-[10px] text-[#58717e]">
                Dashboard behaviour and preferences
              </p>
            </div>

            <div className="divide-y divide-[#0d2b3a]">

              {/* Notifications */}
              <div className="flex items-center justify-between gap-5 px-5 py-4">

                <div>
                  <p className="text-xs font-semibold text-white">
                    Fleet notifications
                  </p>

                  <p className="mt-1 text-[10px] text-[#718c9b]">
                    Receive alerts for important fleet events
                  </p>
                </div>

                <button
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                  className={`flex h-5 w-9 shrink-0 items-center rounded-full p-[2px] transition ${
                    notifications
                      ? "bg-cyan"
                      : "bg-[#28404d]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      notifications
                        ? "ml-auto"
                        : "ml-0"
                    }`}
                  />
                </button>

              </div>

              {/* Auto refresh */}
              <div className="flex items-center justify-between gap-5 px-5 py-4">

                <div>
                  <p className="text-xs font-semibold text-white">
                    Auto refresh
                  </p>

                  <p className="mt-1 text-[10px] text-[#718c9b]">
                    Automatically refresh fleet data
                  </p>
                </div>

                <button
                  onClick={() =>
                    setAutoRefresh(!autoRefresh)
                  }
                  className={`flex h-5 w-9 shrink-0 items-center rounded-full p-[2px] transition ${
                    autoRefresh
                      ? "bg-cyan"
                      : "bg-[#28404d]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      autoRefresh
                        ? "ml-auto"
                        : "ml-0"
                    }`}
                  />
                </button>

              </div>

              {/* Refresh rate */}
              <div className="flex items-center justify-between gap-5 px-5 py-4">

                <div>
                  <p className="text-xs font-semibold text-white">
                    Refresh interval
                  </p>

                  <p className="mt-1 text-[10px] text-[#718c9b]">
                    How frequently dashboard data updates
                  </p>
                </div>

                <select
                  value={refreshRate}
                  onChange={(e) =>
                    setRefreshRate(e.target.value)
                  }
                  disabled={!autoRefresh}
                  className="rounded-lg border border-[#12384a] bg-[#061521] px-3 py-2 text-xs text-white outline-none disabled:opacity-40"
                >
                  <option value="10">
                    10 seconds
                  </option>

                  <option value="30">
                    30 seconds
                  </option>

                  <option value="60">
                    1 minute
                  </option>

                  <option value="300">
                    5 minutes
                  </option>
                </select>

              </div>

            </div>
          </section>

          {/* Account */}
          <section className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                ACCOUNT
              </p>

              <p className="mt-1 text-[10px] text-[#58717e]">
                Current dashboard user
              </p>
            </div>

            <div className="p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan/40 bg-[#0a2635] text-sm font-bold text-cyan">
                  AS
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Ananya Sharma
                  </p>

                  <p className="mt-1 text-[10px] text-[#718c9b]">
                    Operations Admin
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* System */}
          <section className="rounded-xl border border-[#12384a] bg-[#03111c]">

            <div className="border-b border-[#12384a] px-5 py-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan">
                SYSTEM
              </p>
            </div>

            <div className="divide-y divide-[#0d2b3a]">

              <div className="flex items-center justify-between px-5 py-4">

                <div>
                  <p className="text-xs font-semibold text-white">
                    API Status
                  </p>

                  <p className="mt-1 text-[10px] text-[#718c9b]">
                    Backend service connection
                  </p>
                </div>

                <span className="rounded-full border border-green/30 bg-green/10 px-2 py-1 text-[8px] font-bold text-green">
                  ONLINE
                </span>

              </div>

              <div className="flex items-center justify-between px-5 py-4">

                <div>
                  <p className="text-xs font-semibold text-white">
                    Fleet OS
                  </p>

                  <p className="mt-1 text-[10px] text-[#718c9b]">
                    MapMyIndia Fleet Management
                  </p>
                </div>

                <span className="font-mono text-[9px] text-[#58717e]">
                  v1.0.0
                </span>

              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}