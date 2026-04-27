"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Download,
  Filter,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  MoreVertical,
  Search,
  Star,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  AnimatedMetric,
  FilterTabs,
  GlowCard,
  Reveal,
  Stagger,
} from "@/components/motion";
import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { PlatformPagination } from "@/components/platform/PlatformPagination";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";

interface RestaurantPartner {
  id: string;
  name: string;
  owner: { fullName: string; email: string };
  cuisine: string;
  city: string;
  status: "ACTIVE" | "INACTIVE";
  ratingAverage: number;
}

const tableTabs = ["Active", "Inactive", "All"] as const;

function statusBadge(status: string) {
  if (status === "ACTIVE") {
    return "rounded-full bg-[rgba(34,197,94,0.12)] px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wider text-[#22c55e]";
  }
  return "rounded-full bg-[rgba(239,68,68,0.14)] px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wider text-[#ef4444]";
}

import { api } from "@/lib/api";

import { api } from "@/lib/api";

export default function PlatformRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantPartner[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsData, statsData] = await Promise.all([
          api.get("/platform/restaurants"),
          api.get("/platform/dashboard"),
        ]);

        setRestaurants(restaurantsData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SuperAdminShell active="All Restaurants">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  const s = stats || {
    totalRestaurants: 0,
    activeRestaurants: 0,
    platformRevenue: 0,
    pendingApprovals: 0,
  };

  return (
    <SuperAdminShell active="All Restaurants">
      <div>
        <Reveal blur>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="m-0 text-2xl font-black tracking-tight text-white uppercase italic">
                Partner Network
              </h1>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#555]">
                Manage restaurant ecosystem & operational standards
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl border border-white/5 bg-[#0d0d0d] px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#111]">
                Network Map
              </button>
              <button className="rounded-xl bg-fly-orange px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                Onboard Venue
              </button>
            </div>
          </div>
        </Reveal>

        <Stagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerMs={50}
        >
          {[
            <GlowCard key="total" className="p-8 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Global Partners
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={s.totalRestaurants}
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="flex items-center text-[0.65rem] font-black text-emerald-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12
                </span>
              </div>
            </GlowCard>,
            <GlowCard key="active" className="p-8 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Active Status
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={s.activeRestaurants}
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-widest text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                  Optimal
                </span>
              </div>
            </GlowCard>,
            <GlowCard key="revenue" className="p-8 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Platform Revenue
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={s.platformRevenue}
                  prefix="$"
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="flex items-center text-[0.65rem] font-black text-emerald-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  8%
                </span>
              </div>
            </GlowCard>,
            <div
              key="audit"
              className="rounded-2xl border border-fly-orange/10 bg-[#1a1208] p-8"
            >
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-fly-orange/60">
                Pending Audit
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={s.pendingApprovals}
                  className="text-3xl font-black tracking-tighter text-fly-orange"
                />
                <span className="rounded-lg bg-fly-orange/10 px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-widest text-fly-orange ring-1 ring-inset ring-fly-orange/20">
                  Action
                </span>
              </div>
            </div>,
          ]}
        </Stagger>

        <Reveal className="mt-10" delay={200}>
          <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-10 py-6">
              <div>
                <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                  Management Directory
                </h2>
                <p className="m-0 mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                  Partner compliance and performance tracking
                </p>
              </div>
              <div className="flex items-center gap-6">
                <FilterTabs tabs={tableTabs} variant="segment" />
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-[#141414] text-[#444] hover:text-white transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#333]">
                    <th className="px-10 py-4">Brand Identity</th>
                    <th className="px-10 py-4">Executive Owner</th>
                    <th className="px-10 py-4">Cuisine / City</th>
                    <th className="px-10 py-4 text-center">Rating</th>
                    <th className="px-10 py-4 text-center">Status</th>
                    <th className="px-10 py-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-10 py-16 text-center text-[0.7rem] font-bold uppercase tracking-widest text-[#333]"
                      >
                        No restaurant partners in directory
                      </td>
                    </tr>
                  ) : (
                    restaurants.map((r, i) => (
                      <tr
                        key={r.id}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#141414] text-[0.7rem] font-black text-[#444] ring-1 ring-white/5">
                              {r.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="block text-[0.8rem] font-black text-white">
                                {r.name}
                              </span>
                              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                                ID: {r.id.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-5">
                          <span className="block text-[0.75rem] font-black text-[#999]">
                            {r.owner?.fullName}
                          </span>
                          <span className="text-[0.65rem] font-bold text-[#444]">
                            {r.owner?.email}
                          </span>
                        </td>
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-[#141414] px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-widest text-[#666] ring-1 ring-white/5">
                              {r.cuisine}
                            </span>
                            <span className="text-[0.65rem] font-black text-[#444] uppercase">
                              {r.city}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-[0.8rem] font-black text-white">
                            <Star className="h-3 w-3 fill-fly-orange text-fly-orange" />
                            {r.ratingAverage || "0.0"}
                          </div>
                        </td>
                        <td className="px-10 py-5 text-center">
                          <span className={statusBadge(r.status)}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#141414] text-[#444] hover:text-white transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-10 py-6 border-t border-white/5">
              <PlatformPagination
                summary={`Monitoring ${restaurants.length} active platform partners`}
                page={1}
                totalPages={1}
              />
            </div>
          </article>
        </Reveal>

        <PlatformFooter />
      </div>
    </SuperAdminShell>
  );
}
