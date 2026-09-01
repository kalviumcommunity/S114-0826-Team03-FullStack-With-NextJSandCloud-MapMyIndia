import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#020b12] text-white">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="min-h-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}