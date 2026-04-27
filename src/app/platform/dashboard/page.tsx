"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/context/SocketContext";
import {
  AlertCircle,
  TrendingUp,
  ChevronRight,
  MapPin,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { AnimatedMetric, GlowCard, Reveal, Stagger } from "@/components/motion";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";
import { PlatformFooter } from "@/components/platform/PlatformFooter";

interface DashboardStats {
  totalRestaurants: number;
  pendingApprovals: number;
  activeRestaurants: number;
  totalCustomers: number;
  platformRevenue: number;
}

interface PendingApplication {
  id: string;
  restaurantName: string;
  category: string;
  submittedAt: string;
  status: string;
}

interface ActivityLog {
  id: string;
  action: string;
  metadata: any;
  createdAt: string;
}

export default function SuperAdminDashboardPage() {
  const { socket } = useSocket();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingApps, setPendingApps] = useState<PendingApplication[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsData, appsData, activityData] = await Promise.all([
        api.get("/platform/dashboard"),
        api.get("/restaurant-applications"),
        api.get("/platform/activity"),
      ]);

      setStats(statsData);
      setPendingApps(
        appsData
          .filter((a: any) => a.status === "NEW" || a.status === "UNDER_REVIEW")
          .slice(0, 5),
      );
      setActivities(activityData.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <SuperAdminShell active="Dashboard">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  const d = stats || {
    totalRestaurants: 0,
    pendingApprovals: 0,
    activeRestaurants: 0,
    totalCustomers: 0,
    platformRevenue: 0,
  };

  return (
    <SuperAdminShell active="Dashboard">
      <div>
        <Reveal blur>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="m-0 text-2xl font-black tracking-tight text-white uppercase italic">
                Platform Overview
              </h1>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#555]">
                Real-time monitoring & administrative control
              </p>
            </div>
            <div className="flex gap-4">
              <button className="rounded-xl border border-white/5 bg-[#0d0d0d] px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#111]">
                Export Data
              </button>
              <button className="rounded-xl bg-fly-orange px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                Audit Trail
              </button>
            </div>
          </div>
        </Reveal>

        <Stagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          staggerMs={50}
        >
          {[
            <GlowCard
              key="restaurants"
              className="p-6 bg-[#0d0d0d] border-white/5"
            >
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Total Restaurants
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <AnimatedMetric
                  value={d.totalRestaurants}
                  className="text-3xl font-black tracking-tighter text-white"
                />
              </div>
            </GlowCard>,
            <div
              key="pending"
              className="group relative overflow-hidden rounded-2xl border border-fly-orange/20 bg-[#1a1208] p-6 transition-all hover:-translate-y-1 hover:border-fly-orange/40"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-fly-orange/5 blur-2xl" />
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-fly-orange/60">
                Pending Approvals
              </p>
              <div className="mt-4 flex items-center justify-between">
                <AnimatedMetric
                  value={d.pendingApprovals}
                  className="text-3xl font-black tracking-tighter text-fly-orange"
                />
                <span className="flex items-center gap-1.5 rounded-full bg-fly-orange/10 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-widest text-fly-orange ring-1 ring-inset ring-fly-orange/20">
                  <AlertCircle className="h-3 w-3" />
                  Action
                </span>
              </div>
            </div>,
            <GlowCard key="active" className="p-6 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Active Venues
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <AnimatedMetric
                  value={d.activeRestaurants}
                  className="text-3xl font-black tracking-tighter text-white"
                />
              </div>
            </GlowCard>,
            <GlowCard
              key="customers"
              className="p-6 bg-[#0d0d0d] border-white/5"
            >
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Total Customers
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <AnimatedMetric
                  value={d.totalCustomers}
                  className="text-3xl font-black tracking-tighter text-white"
                />
              </div>
            </GlowCard>,
            <GlowCard key="revenue" className="p-6 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Platform Revenue
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={d.platformRevenue}
                  prefix="$"
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="flex items-center text-[0.65rem] font-black text-emerald-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  12.4%
                </span>
              </div>
            </GlowCard>,
          ]}
        </Stagger>

        <section className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_360px]">
          <Reveal delay={200} direction="up">
            <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d0d]">
              <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
                <div>
                  <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                    Pending Verification
                  </h2>
                  <p className="m-0 mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#444]">
                    Applications requiring executive review
                  </p>
                </div>
                <Link
                  href="/platform/approvals"
                  className="flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-fly-orange no-underline transition-opacity hover:opacity-80"
                >
                  View Queue
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#333]">
                      <th className="px-8 py-4">Restaurant Asset</th>
                      <th className="px-8 py-4">Specialization</th>
                      <th className="px-8 py-4">Submission</th>
                      <th className="px-8 py-4 text-center">Risk Score</th>
                      <th className="px-8 py-4 text-right">Operation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApps.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-8 py-16 text-center text-[0.7rem] font-bold uppercase tracking-widest text-[#333]"
                        >
                          Queue is currently clear
                        </td>
                      </tr>
                    ) : (
                      pendingApps.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#141414] text-[0.7rem] font-black text-[#444] ring-1 ring-white/5">
                                {row.restaurantName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate text-[0.8rem] font-black text-white">
                                  {row.restaurantName}
                                </span>
                                <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                                  <MapPin className="h-3 w-3" />
                                  Kigali, RW
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="rounded-lg bg-[#141414] px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-[#666] ring-1 ring-white/5">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-[0.75rem] font-bold text-[#555]">
                            {formatDistanceToNow(new Date(row.submittedAt), {
                              addSuffix: true,
                            })}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="mx-auto h-1.5 w-16 overflow-hidden rounded-full bg-[#141414] ring-1 ring-white/5">
                              <div
                                className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                style={{ width: "92%" }}
                              />
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <Link
                              href={`/platform/approvals/${row.id}`}
                              className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-[#141414] px-5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-white no-underline transition-all hover:bg-fly-orange hover:border-fly-orange"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </Reveal>

          <aside className="space-y-8">
            <Reveal delay={400} direction="left">
              <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-8 shadow-2xl">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                      System Activity
                    </h2>
                    <p className="m-0 mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                      Real-time audit log
                    </p>
                  </div>
                  <Activity className="h-5 w-5 text-[#333]" />
                </div>
                <ul className="space-y-8 p-0" style={{ listStyle: "none" }}>
                  {activities.length === 0 ? (
                    <li className="py-8 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[#333]">
                      No recent activity
                    </li>
                  ) : (
                    activities.map((item) => (
                      <li key={item.id} className="group flex gap-5">
                        <div className="relative mt-1 flex flex-col items-center">
                          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-fly-orange shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:scale-125 transition-transform" />
                          <div className="absolute top-2.5 h-[calc(100%+2rem)] w-px bg-white/5 last:hidden" />
                        </div>
                        <div className="min-w-0">
                          <p className="m-0 text-[0.8rem] font-bold leading-relaxed text-[#999] group-hover:text-white transition-colors">
                            {item.action.replace(/_/g, " ")}
                          </p>
                          <span className="mt-2 block text-[0.6rem] font-black uppercase tracking-widest text-[#444]">
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <button className="mt-10 w-full rounded-xl border border-white/5 py-3 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444] hover:bg-white/[0.02] hover:text-white transition-all">
                  View Audit History
                </button>
              </article>
            </Reveal>

            <Reveal delay={500} direction="left">
              <div className="rounded-2xl border border-fly-orange/10 bg-[#1a1208] p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-fly-orange/20 flex items-center justify-center text-fly-orange">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-[0.8rem] font-black uppercase tracking-widest text-white">
                    Security Shield
                  </h3>
                </div>
                <p className="text-[0.7rem] font-bold leading-relaxed text-fly-orange/60">
                  The platform is currently operating under standard security
                  protocols. All restaurant assets are being monitored for
                  compliance.
                </p>
              </div>
            </Reveal>
          </aside>
        </section>

        <PlatformFooter />
      </div>
    </SuperAdminShell>
  );
}
