"use client";

export default function Topbar() {
  return (
    <header className="flex h-[58px] items-center gap-4 border-b border-[#12384a] bg-[#03111c]/95 px-5">
      {/* Search */}
      <div className="relative max-w-[520px] flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7894a3]">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Search vehicle ID, driver, or location..."
          className="h-10 w-full rounded-lg border border-[#12384a] bg-[#061521] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#58717e] transition focus:border-cyan focus:shadow-[0_0_12px_rgba(0,217,255,0.08)]"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Location / environment */}
      <div className="hidden text-right xl:block">
        <p className="text-[9px] font-semibold tracking-[0.2em] text-[#4e7180]">
          NEW DELHI // URBAN BLUEPRINT // 2077
        </p>

        <p className="font-mono text-sm font-semibold text-[#7894a3]">
          22:47
        </p>
      </div>

      {/* GPS */}
      <div className="flex h-9 items-center gap-2 rounded-lg border border-[#12384a] bg-[#061521] px-3">
        <span className="status-dot status-moving" />

        <span className="text-xs font-medium text-white">
          GPS Engine:
        </span>

        <span className="text-xs font-bold text-green">
          LIVE
        </span>
      </div>

      {/* System status */}
      <button
        type="button"
        aria-label="System status"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#12384a] bg-[#061521] text-sm text-[#9db5c2] transition hover:border-cyan hover:text-cyan"
      >
        ◉
      </button>

      {/* Settings */}
      <button
        type="button"
        aria-label="Settings"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#12384a] bg-[#061521] text-sm text-[#9db5c2] transition hover:border-cyan hover:text-cyan"
      >
        ⚙
      </button>
    </header>
  );
}