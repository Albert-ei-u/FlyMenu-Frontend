"use client";

import {
  Archive,
  ClipboardCheck,
  Power,
  ShieldCheck,
  Target,
  Truck,
} from "lucide-react";
import { Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCard, adminContent } from "@/components/admin/admin-ui";

const stations = [
  { label: "Station A (Grill)", value: 94, active: true },
  { label: "Station B (Cold)", value: 68, active: false },
  { label: "Expediting", value: 85, active: true },
];

const stock = [
  { name: "Wagyu Ribeye", left: "4.2 kg", level: "LOW", urgent: true },
  { name: "Organic Truffle", left: "150g", level: "20%", urgent: false },
  { name: "Madagascar Vanilla", left: "2 units", level: "15%", urgent: false },
];

const incidents = [
  { icon: Truck, action: "Delivery Delay - Zone 4", resource: "Fleet Unit FLY-042", severity: "MEDIUM", timeline: "12 mins ago", status: "In Progress", statusColor: "text-[#eab308]" },
  { icon: ClipboardCheck, action: "Stock Depletion Alert", resource: "Wagyu Ribeye", severity: "CRITICAL", timeline: "45 mins ago", status: "Unresolved", statusColor: "text-[#888888]" },
  { icon: ShieldCheck, action: "Shift Handover Completed", resource: "Evening Kitchen Crew", severity: "LOW", timeline: "1 hour ago", status: "Resolved", statusColor: "text-[#22c55e]" },
];

export default function OperationsPage() {
  return (
    <AdminShell active="Operations" searchPlaceholder="Search menu items...">
      <div className={`${adminContent} min-h-screen pb-20`}>
        <Reveal blur className="flex flex-wrap items-start justify-between gap-4 border-b border-[#262626] pb-6">
          <div>
            <h1 className="m-0 text-3xl font-black text-white tracking-tight">Operations Command</h1>
            <p className="mt-1.5 text-[0.95rem] text-[#9a9a9a]">Real-time oversight of kitchen, fleet, and inventory.</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#333333] bg-[#141414] px-5 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-transparent border border-[#333] text-[#888]">
              <Power className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">System Power</span>
              <div className="flex items-center gap-3">
                <strong className="text-sm font-bold text-white tracking-wide">Live Service</strong>
                <div className="relative h-6 w-11 rounded-full bg-fly-orange/20 cursor-pointer border border-fly-orange/50">
                  <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-fly-orange transition-transform translate-x-5" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* KITCHEN THROUGHPUT */}
          <Reveal delay={80}>
            <article className="flex h-full flex-col justify-between rounded-3xl border border-[#4a2411] bg-gradient-to-b from-[#3a1d0d] to-[#141414] p-8 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="m-0 text-sm font-bold uppercase tracking-widest text-[#fcd34d]">Kitchen Throughput</h2>
                  <p className="mt-2 text-base text-[#ccc]">Optimal Flow</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-[#fcd34d]">82%</span>
                  <p className="text-xs font-bold text-[#888] uppercase tracking-widest">Capacity</p>
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-8">
                {stations.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#888]">{s.label}</span>
                      <span className="text-[#ccc]">{s.value}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#262626]">
                      <div 
                        className={`h-full rounded-full ${s.active ? "bg-[#fcd34d]" : "bg-[#444]"}`} 
                        style={{ width: `${s.value}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-center rounded-2xl bg-[#1a1a1a]/50 p-5 backdrop-blur-sm border border-[#333]">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888]">Avg. Prep Time</span>
                  <strong className="mt-1 text-2xl font-black text-white">14.2 <span className="text-sm font-bold text-[#888]">min</span></strong>
                </div>
                <div className="flex flex-col justify-center rounded-2xl bg-[#1a1a1a]/50 p-5 backdrop-blur-sm border border-[#333]">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888]">Active Tickets</span>
                  <strong className="mt-1 text-2xl font-black text-white">28</strong>
                </div>
              </div>
            </article>
          </Reveal>

          {/* CRITICAL STOCK */}
          <Reveal delay={140}>
            <article className="flex h-full flex-col rounded-3xl border border-[#262626] bg-[#141414] p-8 shadow-2xl">
              <h2 className="m-0 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#ccc]">
                <Archive className="h-5 w-5 text-white" /> Critical Stock
              </h2>
              
              <div className="mt-8 flex flex-col gap-4 flex-1">
                {stock.map((item) => (
                  <div key={item.name} className={`flex flex-col justify-between rounded-2xl p-5 ${item.urgent ? "border border-[#4a2411] bg-[#1a110a]" : "border border-[#262626] bg-[#1a1a1a]"}`}>
                    <div className="flex items-start justify-between">
                      <strong className="text-sm font-bold text-white leading-tight w-2/3">{item.name}</strong>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${item.urgent ? "bg-[#fcd34d] text-black" : "bg-[#333] text-[#888]"}`}>
                        {item.level}
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between border-t border-[#333] pt-4">
                      <span className="text-xs font-medium text-[#888]">
                        Remaining: <b className="text-white">{item.left}</b>
                      </span>
                      <a href="#" className={`text-[0.65rem] font-bold uppercase tracking-widest hover:underline ${item.urgent ? "text-fly-orange underline decoration-fly-orange" : "text-[#888] hover:text-white"}`}>
                        Reorder
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="mt-6 w-full rounded-2xl border border-dashed border-[#444] bg-transparent py-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#888] transition-colors hover:border-[#666] hover:text-white">
                View Full Inventory
              </button>
            </article>
          </Reveal>

          {/* FLEET PULSE */}
          <Reveal delay={200} direction="right">
            <section className="flex h-full flex-col gap-4">
              <article className="relative flex-1 rounded-3xl border border-[#262626] bg-[#1a1a1a] p-6 shadow-2xl overflow-hidden min-h-[360px]">
                {/* Simulated Map Background - Using an SVG pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#444 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-transparent via-white to-transparent transform rotate-45 pointer-events-none"></div>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex flex-col rounded-2xl bg-[#111] p-4 border border-[#333]">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888]">Fleet Pulse</span>
                    <strong className="mt-1 text-xl font-bold text-white tracking-wide">12 Active</strong>
                  </div>
                  <button className="grid h-12 w-12 place-items-center rounded-2xl bg-fly-orange/10 text-fly-orange transition-colors hover:bg-fly-orange/20 border border-fly-orange/20">
                    <Target className="h-5 w-5" />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 z-10">
                  <div className="flex flex-col rounded-xl bg-[#111] p-3 border border-[#333] shadow-xl w-1/2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#888]">FLY-081</span>
                    <strong className="mt-1 text-xs font-bold text-white">3.2km away</strong>
                    <span className="mt-2 flex items-center gap-1.5 text-[0.65rem] font-bold text-[#22c55e]">
                      <i className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> On Time
                    </span>
                  </div>
                  <div className="flex flex-col rounded-xl bg-[#111] p-3 border border-[#333] shadow-xl w-1/2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#888]">FLY-042</span>
                    <strong className="mt-1 text-xs font-bold text-white">8.1km away</strong>
                    <span className="mt-2 flex items-center gap-1.5 text-[0.65rem] font-bold text-[#fcd34d]">
                      <i className="h-1.5 w-1.5 rounded-full bg-[#fcd34d]" /> Delayed
                    </span>
                  </div>
                </div>
              </article>
              
              <div className="grid grid-cols-2 gap-4">
                <article className="flex flex-col justify-center rounded-3xl border border-[#262626] bg-[#141414] p-6">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888]">Avg. Delivery</span>
                  <strong className="mt-1 text-2xl font-black text-white">24 <span className="text-sm font-bold text-[#888]">min</span></strong>
                </article>
                <article className="flex flex-col justify-center rounded-3xl border border-[#262626] bg-[#141414] p-6">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888]">Fleet Load</span>
                  <strong className="mt-1 text-2xl font-black text-white">68 <span className="text-sm font-bold text-[#888]">%</span></strong>
                </article>
              </div>
            </section>
          </Reveal>
        </section>

        <Reveal className="mt-6" delay={240}>
          <section className="rounded-3xl border border-[#262626] bg-[#141414] p-6 shadow-2xl">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="m-0 text-base font-medium text-[#ccc]">Operational Activity Log</h2>
              <div className="flex gap-4">
                <button type="button" className="rounded-xl border border-[#333] bg-[#1a1a1a] px-6 py-2.5 text-xs font-bold text-[#888] transition-colors hover:bg-[#222]">
                  Filter
                </button>
                <button type="button" className="rounded-xl bg-fly-orange px-6 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] transition-transform hover:scale-105">
                  Export Report
                </button>
              </div>
            </header>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-[#262626] pb-4 text-[0.65rem] font-bold uppercase tracking-widest text-[#666]">
                  <span>Incident / Action</span>
                  <span>Resource</span>
                  <span>Severity</span>
                  <span>Timeline</span>
                  <span>Status</span>
                </div>
                
                <div className="flex flex-col">
                  {incidents.map((incident, i) => {
                    const Icon = incident.icon;
                    return (
                      <Reveal key={incident.action} delay={i * 50} direction="up">
                        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] items-center gap-4 border-b border-[#262626]/50 py-5 text-sm last:border-0 hover:bg-[#1a1a1a]/50">
                          <strong className="flex items-center gap-3 text-white font-bold">
                            <Icon className="h-4 w-4 text-[#888]" />
                            {incident.action}
                          </strong>
                          <span className="text-[#aaa] font-medium">{incident.resource}</span>
                          <span className={`w-fit rounded px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-widest ${
                            incident.severity === "MEDIUM" ? "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20" : 
                            incident.severity === "CRITICAL" ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20" : 
                            "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                          }`}>
                            {incident.severity}
                          </span>
                          <span className="text-[#888] font-medium">{incident.timeline}</span>
                          <span className={`flex items-center gap-2 font-medium ${incident.statusColor}`}>
                            <i className={`h-1.5 w-1.5 rounded-full ${incident.statusColor.replace('text-', 'bg-')}`} />
                            {incident.status}
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </AdminShell>
  );
}

