"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Fleet Dashboard",
    href: "/",
    icon: "▦",
  },
  {
    label: "Vehicles",
    href: "/vehicles",
    icon: "▱",
  },
  {
    label: "Drivers",
    href: "/drivers",
    icon: "♙",
  },
  {
    label: "Trips",
    href: "/trips",
    icon: "⇄",
  },
  {
    label: "Geofences",
    href: "/geofences",
    icon: "⌾",
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: "⚙",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "▤",
  },
  {
    label: "Insights",
    href: "/insights",
    icon: "♧",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "⚙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[208px] shrink-0 flex-col border-r border-[#12384a] bg-[#03111c]">
      {/* Brand */}
      <div className="flex h-[64px] items-center gap-3 border-b border-[#12384a] px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan bg-cyan/10 text-lg text-cyan">
          ◎
        </div>

        <div className="leading-none">
          <div className="text-[15px] font-bold tracking-tight text-white">
            MapmyIndia
          </div>

          <div className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-cyan">
            FLEET OS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
                  isActive
                    ? "bg-cyan/10 text-cyan"
                    : "text-[#8ca6b4] hover:bg-[#0a1d2b] hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 h-6 w-[2px] rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
                )}

                <span
                  className={`flex w-5 justify-center text-base ${
                    isActive
                      ? "text-cyan"
                      : "text-[#7894a3] group-hover:text-cyan"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="flex-1 truncate">
                  {item.label}
                </span>

                {item.badge !== undefined && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-green bg-green/10 px-1.5 text-[10px] font-bold text-green">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom controls */}
      <div className="border-t border-[#12384a] p-3">
        {/* Dark mode */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-[#061521] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-cyan">☾</span>
            <span className="text-xs font-medium text-[#b4c8d2]">
              Dark Mode
            </span>
          </div>

          <div className="flex h-5 w-9 items-center rounded-full bg-cyan p-[2px]">
            <div className="ml-auto h-4 w-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 rounded-lg px-1 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan/40 bg-[#0a2635] text-xs font-bold text-cyan">
            AS
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              Ananya Sharma
            </p>

            <p className="truncate text-[10px] text-[#718c9b]">
              Operations Admin
            </p>
          </div>

          <span className="text-xs text-[#718c9b]">
           ⌄
          </span>
        </div>
      </div>
    </aside>
  );
}