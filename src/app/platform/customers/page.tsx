"use client";

import { useEffect, useState } from "react";
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

interface CustomerRow {
  id: string;
  user: {
    fullName: string;
    email: string;
    status: string;
  };
  city: string;
  createdAt: string;
}

const filterPills = [
  "All",
  "Active",
  "Inactive",
  "Premium",
  "New This Week",
] as const;

const accentStyles = [
  "border-l-[#888888]",
  "border-l-[#22c55e]",
  "border-l-fly-orange",
  "border-l-[#eab308]",
] as const;

import { Download, MoreVertical } from "lucide-react";
import { api } from "@/lib/api";

export default function PlatformCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.get("/platform/customers");
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <SuperAdminShell active="All Customers">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  const statCards = [
    {
      label: "Total Customers",
      value: customers.length,
      trend: "+4.2%",
    },
    {
      label: "Active Status",
      value: customers.filter((c) => c.user.status === "ACTIVE").length,
      trend: "Optimal",
    },
    {
      label: "Recent Joins",
      value: customers.filter(
        (c) =>
          new Date(c.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ).length,
      trend: "7d Window",
    },
    {
      label: "Global Reach",
      value: new Set(customers.map((c) => c.city)).size,
      trend: "Cities",
    },
  ] as const;

  return (
    <SuperAdminShell active="All Customers">
      <div>
        <Reveal blur>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="m-0 text-2xl font-black tracking-tight text-white uppercase italic">
                Customer Management
              </h1>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#555]">
                Platform-wide user directory & engagement metrics
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl border border-white/5 bg-[#0d0d0d] px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#111]">
                Export List
              </button>
              <button className="rounded-xl bg-fly-orange px-6 py-2.5 text-[0.7rem] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                Broadcast Alert
              </button>
            </div>
          </div>
        </Reveal>

        <Stagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerMs={50}
        >
          {statCards.map((card) => (
            <GlowCard
              key={card.label}
              className="p-8 bg-[#0d0d0d] border-white/5"
            >
              <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#444]">
                {card.label}
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <AnimatedMetric
                  value={card.value}
                  className="text-3xl font-black tracking-tighter text-white"
                />
                <span className="text-[0.65rem] font-black text-emerald-500 uppercase tracking-widest">
                  {card.trend}
                </span>
              </div>
            </GlowCard>
          ))}
        </Stagger>

        <Reveal className="mt-10" delay={200}>
          <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-10 py-6">
              <div>
                <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                  User Directory
                </h2>
                <p className="m-0 mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#444]">
                  Comprehensive list of registered consumers
                </p>
              </div>
              <div className="flex items-center gap-6">
                <FilterTabs tabs={filterPills} variant="segment" />
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-[#141414] text-[#444] hover:text-white transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#333]">
                    <th className="px-10 py-4">Customer Asset</th>
                    <th className="px-10 py-4">City</th>
                    <th className="px-10 py-4">Registration</th>
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4 text-right">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-10 py-16 text-center text-[0.7rem] font-bold uppercase tracking-widest text-[#333]"
                      >
                        No registered customers found
                      </td>
                    </tr>
                  ) : (
                    customers.map((c, i) => (
                      <tr
                        key={c.id}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#141414] text-[0.7rem] font-black text-[#444] ring-1 ring-white/5">
                              {c.user.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="block text-[0.8rem] font-black text-white">
                                {c.user.fullName}
                              </span>
                              <span className="text-[0.65rem] font-bold text-[#444]">
                                {c.user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-5">
                          <span className="text-[0.75rem] font-black text-[#999] uppercase tracking-widest">
                            {c.city || "Global"}
                          </span>
                        </td>
                        <td className="px-10 py-5">
                          <span className="text-[0.75rem] font-black text-[#555]">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-10 py-5">
                          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[0.55rem] font-black uppercase tracking-[0.2em] text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                            Active
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
                summary={`Managing ${customers.length} registered platform consumers`}
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
