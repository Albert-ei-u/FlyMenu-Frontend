"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Edit3,
  Mail,
  Megaphone,
  Phone,
  Plus,
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedMetric, GlowCard, Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  adminPageTitleH1,
  adminPageTitleP,
  clientKpiGrid,
  clientLayout,
  primaryAction,
  secondaryAction,
  titleRow,
  segmentControl,
  segmentActive,
  segmentIdle,
} from "@/components/admin/admin-ui";

interface Client {
  id: string;
  loyaltyTier: string;
  preferences: string[];
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  lastVisit?: string;
  venue?: string;
  orders?: number;
  spend?: string;
  avatar?: string | null;
  points?: string;
  status?: string;
}

import { api } from "@/lib/api";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/restaurant/login");
        return;
      }

      try {
        const data = await api.get("/clients");
        setClients(data);
        if (data.length > 0) setSelectedClient(data[0]);
      } catch (err: any) {
        console.error("Failed to fetch clients:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  if (loading) {
    return (
      <AdminShell active="Clients">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  const currentSelected = selectedClient || clients[0];

  return (
    <AdminShell active="Clients">
      <div className={adminContent}>
        <Reveal blur>
          <div className={titleRow}>
            <div>
              <h1 className={adminPageTitleH1}>Client Management</h1>
              <p className={adminPageTitleP}>
                Centralize relationships, monitor spending habits, and manage
                loyalty rewards.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={secondaryAction}>
                <Download className="h-4 w-4" />
                Export Data
              </button>
              <a className={primaryAction} href="/admin/clients/new">
                <Plus className="h-5 w-5" />
                New Client
              </a>
            </div>
          </div>
        </Reveal>

        <Stagger className={clientKpiGrid} staggerMs={90}>
          {[
            <GlowCard key="active" className="p-6">
              <small className="text-[0.65rem] font-bold uppercase tracking-wider text-[#888888]">
                Active Customers
              </small>
              <div className="mt-2 flex items-baseline gap-2">
                <AnimatedMetric
                  value={clients.length}
                  className="text-3xl font-black text-white"
                />
              </div>
            </GlowCard>,
            <GlowCard key="loyalty" className="p-6">
              <small className="text-[0.65rem] font-bold uppercase tracking-wider text-[#888888]">
                Avg. Loyalty Points
              </small>
              <div className="mt-2 flex items-baseline gap-1">
                <strong className="text-3xl font-black text-white">
                  {clients.length > 0 ? (clients.reduce((acc, c) => acc + parseInt(c.points || "0"), 0) / clients.length).toFixed(0) : 0}
                </strong>
                <span className="text-sm font-bold text-[#666666]">pts</span>
              </div>
            </GlowCard>,
            <GlowCard key="ltv" className="p-6">
              <small className="text-[0.65rem] font-bold uppercase tracking-wider text-[#888888]">
                Total Customer Base
              </small>
              <div className="mt-2 flex items-baseline gap-2">
                <AnimatedMetric
                  value={clients.length}
                  className="text-3xl font-black text-white"
                />
              </div>
            </GlowCard>,
          ]}
        </Stagger>

        <section className={clientLayout}>
          <div className="space-y-6">
            <Reveal delay={120}>
              <article className={`${adminCard} overflow-hidden`}>
                <header className="flex items-center justify-between border-b border-[#262626] p-6">
                  <h2 className="text-lg font-bold text-white">
                    Client Directory
                  </h2>
                </header>

                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1fr] border-b border-[#262626] bg-[#1a1a1a] px-6 py-4 text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                      <span>Client Name</span>
                      <span>Loyalty Status</span>
                      <span>Last Visit</span>
                      <span>Total Orders</span>
                    </div>

                    <div className="divide-y divide-[#262626]">
                      {clients.length === 0 ? (
                        <div className="p-10 text-center text-sm text-[#555]">
                          No clients found.
                        </div>
                      ) : (
                        clients.map((client, i) => (
                          <Reveal key={client.id} delay={i * 50} direction="up">
                            <div
                              onClick={() => setSelectedClient(client)}
                              className={`grid grid-cols-[1.5fr_1fr_1.2fr_1fr] items-center px-6 py-5 transition-colors hover:bg-[#222222] cursor-pointer ${currentSelected?.id === client.id ? "bg-[#222222]" : ""}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 flex-shrink-0">
                                  {client.avatar ? (
                                    <Image
                                      src={client.avatar}
                                      alt={client.user.fullName}
                                      fill
                                      className="rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#262626] text-xs font-bold text-[#888888]">
                                      {client.user.fullName
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-white">
                                    {client.user.fullName}
                                  </span>
                                  <span className="text-xs text-[#666666]">
                                    {client.user.email}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <span
                                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.6rem] font-black tracking-wider ${
                                    client.loyaltyTier === "PLATINUM"
                                      ? "bg-fly-orange/10 text-fly-orange border border-fly-orange/20"
                                      : client.loyaltyTier === "GOLD"
                                        ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                        : "bg-[#262626] text-[#888888] border border-[#333333]"
                                  }`}
                                >
                                  <Star className="h-2.5 w-2.5 fill-current" />
                                  {client.loyaltyTier}
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm text-white font-medium">
                                  {client.lastVisit || "Never"}
                                </span>
                                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                                  {client.venue || "N/A"}
                                </span>
                              </div>

                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-white">
                                  {client.orders || 0}
                                </span>
                                <span className="text-xs text-[#666666]">
                                  ({client.spend || "$0"})
                                </span>
                              </div>
                            </div>
                          </Reveal>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <footer className="flex items-center justify-between border-t border-[#262626] p-6 text-xs text-[#666666]">
                  <p>Showing 4 of 2,842 clients</p>
                  <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#262626] bg-[#1a1a1a] transition-colors hover:bg-[#262626] disabled:opacity-50">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#262626] bg-[#1a1a1a] transition-colors hover:bg-[#262626]">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </footer>
              </article>
            </Reveal>
          </div>

          <aside className="space-y-6">
            <Reveal delay={180} direction="left">
              <article className={`${adminCard} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">
                    Spender Insight
                  </h2>
                  <TrendingUp className="h-5 w-5 text-fly-orange" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-[#222222] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-fly-orange" />
                      <span className="text-xs font-bold text-[#888888]">
                        Monthly Top Spender
                      </span>
                    </div>
                    <span className="text-sm font-black text-fly-orange">
                      $1,240.00
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#222222] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#888888]" />
                      <span className="text-xs font-bold text-[#888888]">
                        Most Frequent Guest
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-white">12</span>
                      <span className="text-[0.65rem] font-bold text-[#666666]">
                        visits
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <small className="text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                    Recommended Action
                  </small>
                  <div className="mt-3 rounded-xl border border-fly-orange/20 bg-fly-orange/5 p-4 flex gap-4">
                    <Megaphone className="h-5 w-5 text-fly-orange flex-shrink-0" />
                    <p className="text-xs leading-relaxed text-[#bdbdbd]">
                      Send{" "}
                      <span className="font-bold text-white">
                        VIP Anniversary
                      </span>{" "}
                      invite to 14 patrons this week.
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>

            {currentSelected && (
              <Reveal delay={240} direction="left">
                <article className={`${adminCard} p-6`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative h-20 w-20 mb-4">
                      {currentSelected.avatar ? (
                        <Image
                          src={currentSelected.avatar}
                          alt={currentSelected.user.fullName}
                          fill
                          className="rounded-full object-cover border-2 border-fly-orange"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#262626] text-xl font-bold text-[#888888] border-2 border-fly-orange">
                          {currentSelected.user.fullName
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-white leading-tight">
                      {currentSelected.user.fullName}
                    </h2>
                    <span className="text-[0.65rem] font-black tracking-widest text-fly-orange uppercase mt-1">
                      {currentSelected.loyaltyTier} MEMBER
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[#222222] p-4 text-center">
                      <small className="block text-[0.6rem] font-bold uppercase tracking-wider text-[#666666] mb-1">
                        Points
                      </small>
                      <span className="text-sm font-black text-white">
                        {currentSelected.points || "0"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-[#222222] p-4 text-center">
                      <small className="block text-[0.6rem] font-bold uppercase tracking-wider text-[#666666] mb-1">
                        Status
                      </small>
                      <span className="text-[0.65rem] font-black text-[#22c55e] uppercase tracking-wider">
                        {currentSelected.status || "ACTIVE"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <small className="text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                      Preferences
                    </small>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(currentSelected.preferences.length > 0
                        ? currentSelected.preferences
                        : ["No Preferences"]
                      ).map((pref) => (
                        <span
                          key={pref}
                          className="rounded-md bg-[#262626] px-2.5 py-1.5 text-[0.65rem] font-bold text-[#bdbdbd]"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <small className="text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                      Contact Info
                    </small>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-[#bdbdbd]">
                        <Mail className="h-4 w-4 text-[#666666]" />
                        {currentSelected.user.email}
                      </div>
                      {currentSelected.user.phone && (
                        <div className="flex items-center gap-3 text-xs text-[#bdbdbd]">
                          <Phone className="h-4 w-4 text-[#666666]" />
                          {currentSelected.user.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`${secondaryAction} mt-8 w-full`}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                </article>
              </Reveal>
            )}
          </aside>
        </section>
      </div>
    </AdminShell>
  );
}
