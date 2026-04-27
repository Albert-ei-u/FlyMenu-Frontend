"use client";

import { Bell, Search, Settings, ShieldCheck } from "lucide-react";
import React from "react";
import { PlatformSidebar } from "./PlatformSidebar";
import type { PlatformNavKey } from "./PlatformSidebar";

export type { PlatformNavKey };

export function SuperAdminShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: PlatformNavKey;
}) {
  return (
    <div className="flex min-h-screen bg-[#050505] font-sans text-white">
      <PlatformSidebar active={active} />

      <main className="flex-1">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050505]/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-12 flex-1">
              <nav className="flex items-center gap-8">
                {["Dashboard", "Analytics", "System", "Audit", "Network"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`text-[0.8rem] font-black uppercase tracking-[0.2em] transition-colors ${
                        tab === "Dashboard"
                          ? "text-fly-orange"
                          : "text-[#444] hover:text-[#666]"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </nav>

              <div className="relative max-w-md flex-1 group">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#333] group-focus-within:text-fly-orange transition-colors" />
                <input
                  type="text"
                  placeholder="Search platform assets..."
                  className="h-10 w-full rounded-xl border border-white/5 bg-[#0d0d0d] pl-11 pr-4 text-[0.8rem] font-bold text-white outline-none transition-all focus:border-fly-orange/30 focus:bg-[#111]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 rounded-full border border-white/5 bg-[#0d0d0d] px-4 py-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-[#555]">
                  System Status:{" "}
                  <span className="text-emerald-500">Optimal</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative rounded-xl border border-white/5 bg-[#0d0d0d] p-2.5 text-[#444] hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-fly-orange ring-2 ring-[#0d0d0d]" />
                </button>
                <button className="rounded-xl border border-white/5 bg-[#0d0d0d] p-2.5 text-[#444] hover:text-white transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10">{children}</div>
      </main>
    </div>
  );
}
