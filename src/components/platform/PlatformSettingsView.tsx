"use client";

import Image from "next/image";
import { useState, type ComponentType, type ReactNode } from "react";
import { Reveal } from "@/components/motion";
import {
  Activity,
  Bell,
  CreditCard,
  
  Database,
  Globe,
  KeyRound,
  Server,
  Shield,
  User,
  Wallet,
} from "lucide-react";

type SettingsSectionId =
  | "profile"
  | "platform"
  | "billing"
  | "onboarding"
  | "notifications"
  | "security"
  | "system";

const settingsSections: { id: SettingsSectionId; label: string }[] = [
  { id: "profile", label: "My Profile" },
  { id: "platform", label: "General" },
  { id: "billing", label: "Billing" },
  { id: "onboarding", label: "Onboarding" },
  { id: "notifications", label: "Alerts" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

const initialData = {
  profile: {
    fullName: "Admin Root",
    email: "admin@flymenu.com",
    phone: "+1 (555) 000-0000",
    timezone: "UTC",
    role: "SUPER_ADMIN",
    roleLabel: "Platform Owner",
  },
  platform: {
    name: "FlyMenu Platform",
    supportEmail: "support@flymenu.com",
    defaultLocale: "en-US",
    maintenanceMode: false,
    publicSignupEnabled: true,
  },
  billing: {
    registrationFeeUsd: 0,
    transactionFeePercent: 2.5,
    minimumPayoutUsd: 50,
    premiumMonthlyUsd: 49,
    premiumYearlyUsd: 499,
    payoutSchedule: "weekly",
  },
  onboarding: {
    reviewSlaHours: 48,
    autoApprovePartners: false,
    requireBusinessLicense: true,
    requireHealthInspection: true,
    requireTaxCertificate: true,
    notifyOnNewApplication: true,
  },
  notifications: {
    emailNewApplications: true,
    emailRevenueAlerts: true,
    emailSystemIncidents: true,
    emailWeeklyDigest: true,
    pushCriticalAlerts: true,
  },
  security: {
    twoFactorEnabled: false,
    ipAllowlistEnabled: false,
    sessionTimeoutMinutes: 60,
    lastLogin: "Just now",
    lastLoginFrom: "127.0.0.1 (Current Session)",
  },
  system: {
    status: "OPTIMAL",
    activeRestaurants: 0,
    openIncidents: 0,
    activeOrders: 0,
    apiVersion: "v1.0.0",
    database: "healthy" as const,
    storage: "healthy" as const,
    realtime: "healthy" as const,
    checkedAt: new Date().toISOString(),
  },
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2.5 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange";
const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-[#888888]";

function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <article className="hover-lift rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 transition-shadow duration-300">
      <h2 className="m-0 flex items-center gap-2 text-base font-bold text-white">
        {Icon ? <Icon className="h-4 w-4 text-fly-orange" /> : null}
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </article>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-[#666666]">
            {description}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full border-0 transition-colors duration-300 ${
          checked ? "bg-fly-orange" : "bg-[#333333]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ease-out motion-reduce:transition-none ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

function HealthPill({ status }: { status: "healthy" | "degraded" | "down" }) {
  const styles = {
    healthy: "bg-[rgba(34,197,94,0.12)] text-[#22c55e]",
    degraded: "bg-[rgba(249,115,22,0.12)] text-fly-orange",
    down: "bg-[rgba(239,68,68,0.14)] text-[#ef4444]",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-black uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}

import { api } from "@/lib/api";
import { useEffect } from "react";

export function PlatformSettingsView() {
  const [section, setSection] = useState<SettingsSectionId>("profile");
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [dashboard, status] = await Promise.all([
          api.get("/platform/dashboard"),
          api.get("/platform/system-status"),
        ]);

        setData((prev) => ({
          ...prev,
          system: {
            ...prev.system,
            activeRestaurants: dashboard.activeRestaurants,
            activeOrders: dashboard.totalOrders || 0,
            status: status.overallStatus,
            database: status.dbStatus,
            storage: status.storageStatus,
            realtime: status.wsStatus,
            checkedAt: new Date().toISOString(),
          },
        }));
      } catch (err) {
        console.error("Failed to fetch system data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  const handleSave = async () => {
    setSaved(true);
    // In a real app, we'd send a PATCH to /platform/settings here
    window.setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Reveal blur>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="m-0 text-2xl font-black tracking-tight text-white uppercase italic">
              Executive Parameters
            </h1>
            <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#555]">
              Configure global FlyMenu parameters & core platform rules
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-xl border border-white/5 bg-[#0d0d0d] px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-[#444] transition-colors hover:text-white"
              onClick={() => setData(initialData)}
            >
              Reset
            </button>
            <button
              type="button"
              className="rounded-xl bg-fly-orange px-8 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 shadow-[0_8px_20px_rgba(249,115,22,0.2)]"
              onClick={handleSave}
            >
              {saved ? "Synchronized" : "Save Changes"}
            </button>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-3">
        {settingsSections.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSection(tab.id)}
            className={`rounded-xl px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-[0.15em] transition-all ${
              section === tab.id
                ? "bg-white text-black"
                : "text-[#444] hover:text-[#888]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        key={section}
        className="mt-10 animate-fade-in motion-reduce:animate-none"
      >
        {section === "profile" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
            <article className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#0d0d0d] p-10 text-center shadow-2xl">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-white/5">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  alt=""
                  fill
                  className="h-full w-full object-cover"
                />
              </div>
              <strong className="mt-6 text-xl font-black text-white uppercase italic tracking-tight">
                {data.profile.fullName}
              </strong>
              <span className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-fly-orange">
                {data.profile.roleLabel}
              </span>
              <button
                type="button"
                className="mt-8 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444] hover:text-white transition-colors"
              >
                Modify Identity
              </button>
            </article>
            <SettingsCard title="Identity Matrix" icon={User}>
              <div className="grid gap-8 sm:grid-cols-2">
                <label className={labelClass}>
                  Full entity name
                  <input
                    className={inputClass}
                    defaultValue={data.profile.fullName}
                  />
                </label>
                <label className={labelClass}>
                  Executive Email
                  <input
                    className={inputClass}
                    type="email"
                    defaultValue={data.profile.email}
                  />
                </label>
                <label className={labelClass}>
                  Contact Node
                  <input
                    className={inputClass}
                    defaultValue={data.profile.phone}
                  />
                </label>
                <label className={labelClass}>
                  Temporal Zone
                  <select
                    className={inputClass}
                    defaultValue={data.profile.timezone}
                  >
                    <option value="America/New_York">EST / New York</option>
                    <option value="Europe/Paris">CET / Paris</option>
                    <option value="Africa/Kigali">CAT / Kigali</option>
                    <option value="UTC">UTC / Global</option>
                  </select>
                </label>
              </div>
              <div className="mt-10 rounded-xl border border-white/5 bg-[#141414] p-4">
                <p className="m-0 text-[0.65rem] font-black uppercase tracking-widest text-[#333]">
                  Permissions Level:{" "}
                  <strong className="text-fly-orange">
                    {data.profile.role}
                  </strong>
                </p>
              </div>
            </SettingsCard>
          </div>
        )}

        {section === "platform" && (
          <SettingsCard title="System parameters" icon={Globe}>
            <div className="grid gap-8 sm:grid-cols-2">
              <label className={labelClass}>
                Platform Brand Name
                <input
                  className={inputClass}
                  defaultValue={data.platform.name}
                />
              </label>
              <label className={labelClass}>
                Global Support Hub
                <input
                  className={inputClass}
                  type="email"
                  defaultValue={data.platform.supportEmail}
                />
              </label>
            </div>
            <div className="mt-10 space-y-8">
              <ToggleRow
                label="Maintenance Protocol"
                description="Activate system-wide maintenance overlay for all non-executive users."
                checked={data.platform.maintenanceMode}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    platform: { ...d.platform, maintenanceMode: v },
                  }))
                }
              />
              <ToggleRow
                label="Public Access"
                description="Enable public restaurant entity registration across the platform."
                checked={data.platform.publicSignupEnabled}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    platform: { ...d.platform, publicSignupEnabled: v },
                  }))
                }
              />
            </div>
          </SettingsCard>
        )}

        {section === "billing" && (
          <SettingsCard title="Revenue Control" icon={CreditCard}>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <label className={labelClass}>
                Registration Fee (USD)
                <input
                  className={inputClass}
                  type="number"
                  defaultValue={data.billing.registrationFeeUsd}
                />
              </label>
              <label className={labelClass}>
                Platform Fee (%)
                <input
                  className={inputClass}
                  type="number"
                  step="0.1"
                  defaultValue={data.billing.transactionFeePercent}
                />
              </label>
              <label className={labelClass}>
                Min Payout Floor
                <input
                  className={inputClass}
                  type="number"
                  defaultValue={data.billing.minimumPayoutUsd}
                />
              </label>
            </div>
          </SettingsCard>
        )}

        {section === "system" && (
          <div className="space-y-10">
            <Stagger
              className="grid grid-cols-1 gap-6 sm:grid-cols-3"
              staggerMs={50}
            >
              <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-8 shadow-2xl">
                <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                  Operational Venues
                </p>
                <strong className="mt-4 block text-3xl font-black text-white tracking-tighter">
                  {data.system.activeRestaurants}
                </strong>
              </article>
              <article className="rounded-2xl border border-fly-orange/10 bg-[#1a1208] p-8 shadow-2xl">
                <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-fly-orange/60">
                  Open Incidents
                </p>
                <strong className="mt-4 block text-3xl font-black text-fly-orange tracking-tighter">
                  {data.system.openIncidents}
                </strong>
              </article>
              <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-8 shadow-2xl">
                <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                  Active Traffic
                </p>
                <strong className="mt-4 block text-3xl font-black text-white tracking-tighter">
                  {data.system.activeOrders}
                </strong>
              </article>
            </Stagger>

            <SettingsCard title="Infrastructure Matrix" icon={Server}>
              <div className="space-y-4">
                {(
                  [
                    {
                      name: "Platform API",
                      status: data.system.apiVersion,
                      health: "healthy" as const,
                      icon: Activity,
                    },
                    {
                      name: "PostgreSQL Cluster",
                      status: "Primary Database",
                      health:
                        data.system.database === "healthy" ? "healthy" : "down",
                      icon: Database,
                    },
                    {
                      name: "Asset Storage",
                      status: "S3 Compatible",
                      health:
                        data.system.storage === "healthy" ? "healthy" : "down",
                      icon: Server,
                    },
                    {
                      name: "Realtime Gateway",
                      status: "WebSocket Node",
                      health:
                        data.system.realtime === "healthy" ? "healthy" : "down",
                      icon: Activity,
                    },
                  ] as const
                ).map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.name}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-[#141414] px-6 py-4 group hover:border-white/10 transition-all"
                    >
                      <span className="inline-flex items-center gap-4 text-[0.8rem] font-black text-[#999] group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4 text-fly-orange" />
                        <span>
                          {row.name}
                          <span className="ml-3 text-[0.65rem] font-black uppercase tracking-widest text-[#333]">
                            {row.status}
                          </span>
                        </span>
                      </span>
                      <HealthPill status={row.health as any} />
                    </div>
                  );
                })}
              </div>
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-widest text-[#222]">
                Last Audit: {new Date(data.system.checkedAt).toLocaleString()}
              </p>
            </SettingsCard>
          </div>
        )}
      </div>
    </>
  );
}
