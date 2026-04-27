"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Filter,
  MapPin,
  ShieldAlert,
  User,
} from "lucide-react";
import { Reveal, Stagger } from "@/components/motion";
import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { PlatformPagination } from "@/components/platform/PlatformPagination";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";

interface ApplicationCard {
  id: string;
  restaurantName: string;
  city: string;
  applicantName: string;
  submittedAt: string;
  status: string;
}

const filterTabs = ["All", "New", "Urgent", "Flagged"] as const;

function badgeClass(status: string) {
  if (status === "NEW")
    return "bg-fly-orange/10 text-fly-orange ring-1 ring-fly-orange/20";
  if (status === "MORE_INFO_REQUESTED")
    return "bg-red-500/10 text-red-500 ring-1 ring-red-500/20";
  return "bg-[#141414] text-[#444] ring-1 ring-white/5";
}

export default function PlatformApprovalsPage() {
  const [applications, setApplications] = useState<ApplicationCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await api.get("/restaurant-applications");
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminShell active="Pending Approvals">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell active="Pending Approvals">
      <div>
        <Reveal blur>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="m-0 text-2xl font-black tracking-tight text-white uppercase italic">
                Verification Queue
              </h1>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#555]">
                Systematic review of new platform restaurant assets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex rounded-xl border border-white/5 bg-[#0d0d0d] p-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-[0.6rem] font-black uppercase tracking-widest transition-all rounded-lg ${
                      tab === "All"
                        ? "bg-fly-orange text-white"
                        : "text-[#444] hover:text-[#666]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#0d0d0d] text-[#444] transition-colors hover:text-white">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <Stagger className="space-y-4" staggerMs={50}>
          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/5 bg-[#0d0d0d] p-16 text-center">
              <ShieldAlert className="mx-auto h-10 w-10 text-[#222]" />
              <p className="mt-6 text-[0.7rem] font-black uppercase tracking-widest text-[#333]">
                Queue is currently clear
              </p>
            </div>
          ) : (
            applications.map((card) => (
              <article
                key={card.id}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 transition-all hover:border-fly-orange/20 hover:bg-[#111]"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#141414] text-xl font-black text-[#444] ring-1 ring-white/5 group-hover:text-fly-orange transition-colors">
                      {card.restaurantName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-4">
                        <h2 className="m-0 text-lg font-black text-white tracking-tight uppercase italic">
                          {card.restaurantName}
                        </h2>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[0.55rem] font-black uppercase tracking-[0.2em] ${badgeClass(card.status)}`}
                        >
                          {card.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-6 text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                        <span className="inline-flex items-center gap-2 group-hover:text-[#666] transition-colors">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-fly-orange" />
                          {card.city || "Kigali, RW"}
                        </span>
                        <span className="inline-flex items-center gap-2 group-hover:text-[#666] transition-colors">
                          <User className="h-3.5 w-3.5 shrink-0 text-fly-orange" />
                          {card.applicantName || "Private Entity"}
                        </span>
                        <span className="inline-flex items-center gap-2 group-hover:text-[#666] transition-colors">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-fly-orange" />
                          {formatDistanceToNow(new Date(card.submittedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 lg:shrink-0">
                    <div className="flex flex-col gap-2 w-32">
                      <div className="flex justify-between text-[0.6rem] font-black uppercase tracking-widest text-[#333]">
                        <span>Risk Profile</span>
                        <span className="text-emerald-500">92%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#141414] ring-1 ring-white/5">
                        <div
                          className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/platform/approvals/${card.id}`}
                      className="inline-flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-[#141414] px-8 text-[0.65rem] font-black uppercase tracking-[0.2em] text-white no-underline transition-all hover:bg-fly-orange hover:border-fly-orange hover:shadow-[0_8px_20px_rgba(249,115,22,0.2)]"
                    >
                      Review
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </Stagger>

        <div className="mt-12 border-t border-white/5 pt-8">
          <PlatformPagination
            summary={`Monitoring ${applications.length} platform assets`}
            page={1}
            totalPages={1}
          />
        </div>
        <PlatformFooter variant="compact" />
      </div>
    </SuperAdminShell>
  );
}
