"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  ClipboardList,
  Clock,
  History,
  LayoutDashboard,
  Settings,
  UtensilsCrossed,
  Users,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export const PLATFORM_SIDEBAR_WIDTH = 280;

export type PlatformNavKey =
  | "Dashboard"
  | "Pending Approvals"
  | "All Restaurants"
  | "All Customers"
  | "Platform Revenue"
  | "Settings";

interface PlatformSidebarProps {
  active: PlatformNavKey;
}

const navItems: Array<{
  label: Exclude<PlatformNavKey, "Settings">;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard },
  {
    label: "Pending Approvals",
    href: "/platform/approvals",
    icon: ClipboardList,
  },
  {
    label: "All Restaurants",
    href: "/platform/restaurants",
    icon: UtensilsCrossed,
  },
  { label: "All Customers", href: "/platform/customers", icon: Users },
  { label: "Platform Revenue", href: "/platform/revenue", icon: Banknote },
];

export function PlatformSidebar({ active }: PlatformSidebarProps) {
  const settingsActive = active === "Settings";

  return (
    <aside
      className="sticky left-0 top-0 z-40 flex h-screen flex-col justify-between border-r border-white/5 bg-[#0d0d0d] py-8 overflow-y-auto"
      style={{ width: PLATFORM_SIDEBAR_WIDTH }}
      aria-label="Executive Panel navigation"
    >
      <div>
        <div className="flex items-center gap-3 px-8 mb-10">
          <div className="relative h-10 w-10">
            <Image
              src="/flymenu-logo.png"
              alt="FlyMenu"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="min-w-0">
            <strong className="block text-xl font-black tracking-tight text-white uppercase italic">
              FlyMenu
            </strong>
            <small className="mt-0.5 block text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#666]">
              Executive Panel
            </small>
          </span>
        </div>

        <nav className="space-y-1.5 flex flex-col" aria-label="Platform">
          {navItems.map((item) => {
            const isActive = active === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex min-h-12 items-center gap-4 px-8 text-[0.85rem] font-bold no-underline transition-all duration-300 ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-[#666] hover:text-[#999] hover:bg-white/[0.02]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-fly-orange" />
                )}
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive
                      ? "text-fly-orange"
                      : "text-[#444] group-hover:text-[#666]"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-4">
        <div className="mb-6 px-4">
          <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#333] mb-4">
            System
          </p>
          <Link
            href="/platform/settings"
            className={`group flex items-center gap-4 py-3 text-[0.85rem] font-bold no-underline transition-colors ${
              settingsActive ? "text-white" : "text-[#666] hover:text-[#999]"
            }`}
          >
            <Settings
              className={`h-5 w-5 transition-colors ${
                settingsActive
                  ? "text-fly-orange"
                  : "text-[#444] group-hover:text-[#666]"
              }`}
            />
            Settings
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#141414] p-3 shadow-2xl">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
              alt="Admin"
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[0.75rem] font-black text-white truncate">
              Admin Root
            </p>
            <p className="m-0 text-[0.6rem] font-bold text-[#555] uppercase tracking-wider truncate">
              System Overlord
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
