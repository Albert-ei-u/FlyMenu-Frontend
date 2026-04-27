"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  Settings,
  UserRound,
  Utensils,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ADMIN_SIDEBAR_WIDTH = 280;

export type AdminNavKey =
  | "Dashboard"
  | "Menu Management"
  | "Orders"
  | "Staff"
  | "Operations"
  | "Clients"
  | "Settings";

const navItems: Array<{
  label: Exclude<AdminNavKey, "Settings">;
  href: string;
  icon: LucideIcon | string;
}> = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Menu Management", href: "/admin/menu-management", icon: "/icons/Container-icon5.png" },
  { label: "Orders", href: "/admin/orders", icon: "/icons/Container-icon.png" },
  { label: "Staff", href: "/admin/staff", icon: "/icons/Container-icon2.png" },
  { label: "Operations", href: "/admin/operations", icon: "/icons/Container-icon3.png" },
  { label: "Clients", href: "/admin/clients", icon: "/icons/Container-icon4.png" },
];

type AdminSidebarProps = {
  active: AdminNavKey;
};

function NavLink({
  href,
  label,
  icon: IconOrPath,
  isActive,
}: {
  href: string;
  label: string;
  icon: LucideIcon | string;
  isActive: boolean;
}) {
  const isStringIcon = typeof IconOrPath === "string";

  return (
    <Link
      href={href}
      className={`relative flex min-h-12 items-center gap-4 px-6 text-[0.9rem] font-medium no-underline transition-all duration-300 ease-out motion-reduce:transition-none ${
        isActive
          ? "border-r-2 border-r-fly-orange bg-[#241006] text-fly-orange shadow-[inset_0_0_24px_rgba(249,115,22,0.05)]"
          : "border-r-2 border-r-transparent text-[#9a9a9a] hover:bg-[#171717] hover:text-fly-fog"
      }`}
    >
      {isStringIcon ? (
        <div
          className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "bg-fly-orange" : "bg-[#9a9a9a]"}`}
          style={{
            maskImage: `url(${IconOrPath})`,
            WebkitMaskImage: `url(${IconOrPath})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : (
        // @ts-ignore
        <IconOrPath className="h-5 w-5 shrink-0 transition-colors" strokeWidth={isActive ? 2.25 : 1.75} />
      )}
      {label}
    </Link>
  );
}

export function AdminSidebar({ active }: AdminSidebarProps) {
  const settingsActive = active === "Settings";

  return (
    <aside
      className="sticky left-0 top-0 z-40 flex h-screen flex-col justify-between border-r border-[#262626] bg-[#111111] py-6 overflow-y-auto"
      style={{ width: ADMIN_SIDEBAR_WIDTH }}
      aria-label="Restaurant admin navigation"
    >
      <div>
        <div className="flex items-center gap-3 px-6">
          <Image src="/flymenu-logo.png" alt="FlyMenu" width={58} height={58} priority className="shrink-0" />
          <span className="min-w-0">
            <strong className="block text-[1.55rem] font-black leading-none text-white">FlyMenu</strong>
            <small className="mt-1 block text-[0.68rem] font-black uppercase tracking-[0.12em] text-fly-orange">
              Restaurant Admin
            </small>
          </span>
        </div>

        <nav className="mt-8 space-y-2 flex flex-col" aria-label="Admin">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={active === item.label}
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <NavLink
          href="/admin/settings"
          label="Settings"
          icon={Settings}
          isActive={settingsActive}
        />
        <div className="mx-6 mb-6 rounded-[10px] border border-[#2a2a2a] bg-[#1a1a1a] p-4">
          <p className="m-0 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#a3a3a3]">System Status</p>
          <span className="mt-3 flex items-center gap-2 text-[0.82rem] font-bold text-[#22c55e]">
            <i className="h-2 w-2 rounded-full bg-[#22c55e]" />
            Live & Operational
          </span>
        </div>
      </div>
    </aside>
  );
}
