"use client";

import { useEffect, useState } from "react";
import {
  Download,
  TrendingUp,
  LayoutGrid,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  AnimatedMetric,
  DonutChart,
  FilterTabs,
  GlowCard,
  Reveal,
  Stagger,
} from "@/components/motion";
import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";
import { api } from "@/lib/api";

const chartPeriods = ["Monthly", "Weekly", "Daily"] as const;

export default function PlatformRevenuePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get("/platform/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch revenue stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <SuperAdminShell active="Platform Revenue">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  const r = stats || { platformRevenue: 0, totalRestaurants: 0 };

  const revenueBySource = [
    { label: "Subscriptions", value: 65, color: "#f97316", pct: 65 },
    { label: "Platform Fees", value: 25, color: "#22c55e", pct: 25 },
    { label: "Add-ons", value: 10, color: "#3b82f6", pct: 10 },
  ];

  const monthlyRevenueChart = [
    { month: "JAN", value: 42000 },
    { month: "FEB", value: 48000 },
    { month: "MAR", value: 45000 },
    { month: "APR", value: 52000 },
    { month: "MAY", value: 61000 },
    { month: "JUN", value: 59000 },
  ];

  return (
    <SuperAdminShell active="Platform Revenue">
      <div className="px-8 py-8 max-lg:px-4">
        <Reveal blur>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="m-0 text-2xl font-black tracking-tight text-white uppercase italic">
                Platform Revenue
              </h1>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#555]">
                Financial oversight & transaction analytics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button className="rounded-xl border border-white/5 bg-[#0d0d0d] px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#111]">
                Reports
              </button>
              <button className="rounded-xl bg-fly-orange px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                Process Payouts
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
                Total Revenue
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={r.platformRevenue}
                  prefix="$"
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="flex items-center text-[0.65rem] font-black text-emerald-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  14%
                </span>
              </div>
            </GlowCard>,
            <GlowCard key="fee" className="p-8 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Transaction Fee
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={r.platformRevenue * 0.05}
                  prefix="$"
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="text-[0.65rem] font-black text-[#333] uppercase tracking-widest">
                  5% Avg
                </span>
              </div>
            </GlowCard>,
            <GlowCard key="net" className="p-8 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Net Income
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={r.platformRevenue * 0.95}
                  prefix="$"
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="flex items-center text-[0.65rem] font-black text-emerald-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  8%
                </span>
              </div>
            </GlowCard>,
            <GlowCard key="subs" className="p-8 bg-[#0d0d0d] border-white/5">
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                Active Subscriptions
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={Math.floor(r.totalRestaurants * 0.8)}
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="text-[0.65rem] font-black text-[#333] uppercase tracking-widest">
                  80% Yield
                </span>
              </div>
            </GlowCard>,
          ]}
        </Stagger>

        <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal delay={200} direction="up">
            <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                    Revenue Analytics
                  </h2>
                  <p className="m-0 mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                    Historical performance metrics
                  </p>
                </div>
                <FilterTabs tabs={chartPeriods} variant="segment" />
              </div>
              <div className="h-64 flex items-end justify-between gap-4">
                {monthlyRevenueChart.map((bar) => (
                  <div
                    key={bar.month}
                    className="flex flex-1 flex-col items-center gap-4 group"
                  >
                    <div className="relative w-full">
                      <div
                        className="w-full rounded-t-lg bg-[#141414] transition-all group-hover:bg-white/[0.05]"
                        style={{ height: "200px" }}
                      />
                      <div
                        className="absolute bottom-0 w-full rounded-t-lg bg-fly-orange shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-700"
                        style={{ height: `${(bar.value / 61000) * 100}%` }}
                      />
                    </div>
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-[#333] group-hover:text-white transition-colors">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          <Reveal delay={300} direction="up">
            <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                    Source Breakdown
                  </h2>
                  <p className="m-0 mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                    Revenue distribution by vertical
                  </p>
                </div>
                <LayoutGrid className="h-5 w-5 text-[#333]" />
              </div>
              <div className="flex flex-col items-center gap-12 sm:flex-row">
                <div className="relative">
                  <DonutChart
                    segments={revenueBySource}
                    center={
                      <div className="flex flex-col items-center">
                        <span className="text-[0.5rem] font-black uppercase tracking-widest text-[#333]">
                          Volume
                        </span>
                        <strong className="text-xl font-black text-white">
                          ${r.platformRevenue}
                        </strong>
                      </div>
                    }
                  />
                </div>
                <div className="flex-1 space-y-8">
                  {revenueBySource.map((s) => (
                    <div key={s.label} className="group cursor-default">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-3 text-[0.7rem] font-black uppercase tracking-widest text-[#666] group-hover:text-white transition-colors">
                          <i
                            className="h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]"
                            style={{ background: s.color, color: s.color }}
                          />
                          {s.label}
                        </span>
                        <span className="text-[0.7rem] font-black text-white">
                          {s.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#141414] ring-1 ring-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ background: s.color, width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        </section>

        <Reveal delay={400} direction="up" className="mt-10">
          <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-10 py-6">
              <div>
                <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                  Recent Invoices
                </h2>
                <p className="m-0 mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                  Platform-wide transaction history
                </p>
              </div>
              <button className="flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-fly-orange hover:opacity-80 transition-opacity">
                View Ledger
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#333]">
                    <th className="px-10 py-4">Invoice Asset</th>
                    <th className="px-10 py-4">Recipient</th>
                    <th className="px-10 py-4">Amount</th>
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4 text-right">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-9 w-9 rounded-xl bg-[#141414] flex items-center justify-center text-fly-orange ring-1 ring-white/5">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="block text-[0.8rem] font-black text-white">
                              INV-2024-00{i}
                            </span>
                            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                              Jun {12 + i}, 2024
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        <span className="text-[0.75rem] font-black text-[#999]">
                          Bisimillah Resto
                        </span>
                      </td>
                      <td className="px-10 py-5 text-[0.8rem] font-black text-white">
                        ${(Math.random() * 500 + 100).toFixed(2)}
                      </td>
                      <td className="px-10 py-5">
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[0.55rem] font-black uppercase tracking-[0.2em] text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                          Settled
                        </span>
                      </td>
                      <td className="px-10 py-5 text-right">
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#141414] text-[#444] hover:text-white transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </Reveal>

        <PlatformFooter />
      </div>
    </SuperAdminShell>
  );
}
