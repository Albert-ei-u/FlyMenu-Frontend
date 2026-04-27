"use client";

import Link from "next/link";
import {
  Camera,
  ChevronDown,
  Mail,
  Phone,
  X,
  Plus,
  ListFilter,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import { AnimatedMetric, GlowCard, Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCard, adminContent, mobileFilter } from "@/components/admin/admin-ui";

const staff = [
  { image: "/food1.png", name: "Elena Petrov", id: "4421-E", role: "Chef", status: "Active", efficiency: 98, hours: "156.5" },
  { image: "/chicken-french.png", name: "Marcus Wright", id: "8892-W", role: "Waiter", status: "Active", efficiency: 92, hours: "142.0" },
  { image: "/big-pizza-1.png", name: "Sarah Jenkins", id: "1022-M", role: "Manager", status: "Off-duty", efficiency: 99, hours: "160.0" },
  { image: "/banner-img-260x260.png", name: "David Chen", id: "5561-C", role: "Chef", status: "Active", efficiency: 87, hours: "118.2" },
];

const roleColors: Record<string, string> = {
  chef: "border border-fly-orange/30 text-fly-orange bg-fly-orange/10",
  waiter: "border border-[#d97706]/30 text-[#d97706] bg-[#d97706]/10",
  manager: "border border-[#eab308]/30 text-[#eab308] bg-[#eab308]/10",
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
    {children}
  </label>
);

const Input = ({ className = "", prefixIcon, ...props }: any) => (
  <div className={`relative mt-2 ${className}`}>
    {prefixIcon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]">
        {prefixIcon}
      </div>
    )}
    <input
      className={`w-full rounded-lg border border-[#333333] bg-[#141414] py-3 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange transition-colors ${prefixIcon ? 'pl-10 pr-4' : 'px-4'}`}
      {...props}
    />
  </div>
);

export default function NewStaffPage() {
  return (
    <AdminShell active="Staff" searchPlaceholder="Search menu items...">
      <div className={`${adminContent} min-h-screen pb-20 pointer-events-none blur-[2px] opacity-40`}>
        {/* Render background page statically so modal looks like an overlay */}
        <Reveal blur>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#262626] pb-6">
            <div>
              <h1 className="m-0 text-3xl font-black text-white tracking-tight">Staff Management</h1>
              <p className="mt-1.5 text-[0.95rem] text-[#9a9a9a]">Oversee team performance and operational assignments.</p>
            </div>
            <button className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-fly-orange px-6 font-bold text-white">
              <Plus className="h-5 w-5" /> Add Staff Member
            </button>
          </div>
        </Reveal>
        <Stagger className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3" staggerMs={90}>
          <article className={`${adminCard} relative p-6`}>
            <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">Total Active Crew</small>
            <AnimatedMetric value={42} className="mt-2 block text-4xl font-black text-white" />
            <UsersRound className="absolute right-6 top-6 h-10 w-10 text-[#333]" />
          </article>
          <article className={`${adminCard} p-6`}>
             <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">Avg Efficiency</small>
             <AnimatedMetric value={94.2} suffix="%" decimals={1} className="mt-2 block text-4xl font-black text-white" />
          </article>
          <article className={`${adminCard} border-[#4a2411] bg-[#1f1408] p-6`}>
             <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">Peak Shift Coverage</small>
             <AnimatedMetric value={100} suffix="%" className="mt-2 block text-4xl font-black text-white" />
          </article>
        </Stagger>
      </div>

      {/* MODAL OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <form className="relative w-full max-w-[800px] overflow-hidden rounded-2xl border border-[#333333] bg-[#0a0a0a] shadow-2xl">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#262626] p-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Add New Staff Member</h1>
              <p className="mt-1 text-sm text-[#888888]">Register a new employee to the restaurant roster.</p>
            </div>
            <Link href="/admin/staff" className="rounded-full p-2 text-[#888888] hover:bg-[#222] hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
            {/* Left Column */}
            <section className="flex flex-col gap-6">
              <Label>
                Full Name
                <Input placeholder="e.g. Jonathan Fly" />
              </Label>
              
              <Label>
                Role
                <div className="relative mt-2">
                  <select className="w-full appearance-none rounded-lg border border-[#333333] bg-[#141414] px-4 py-3 text-sm text-white outline-0 focus:border-fly-orange transition-colors">
                    <option>Chef</option>
                    <option>Waiter</option>
                    <option>Manager</option>
                    <option>Logistics</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
                </div>
              </Label>

              <Label>
                Employee ID
                <Input placeholder="FLY-2024-001" />
              </Label>
            </section>

            {/* Right Column */}
            <section className="flex flex-col gap-6">
              <div className="flex h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#444] bg-[#111] cursor-pointer hover:bg-[#151515] transition-colors">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-fly-orange/10 text-fly-orange">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-[#888]">Upload Portrait</span>
              </div>

              <div>
                <Label>Contact Information</Label>
                <div className="mt-2 flex flex-col gap-3">
                  <Input type="email" placeholder="Email Address" prefixIcon={<Mail className="h-4 w-4" />} />
                  <Input type="tel" placeholder="Phone Number" prefixIcon={<Phone className="h-4 w-4" />} />
                </div>
              </div>
            </section>
          </div>

          <div className="px-8 pb-8">
            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-[#3d2a18] bg-[#1a1008] p-4">
              <div className="relative mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[#663c1a] bg-[#111]">
                <input type="checkbox" className="peer absolute h-full w-full opacity-0 cursor-pointer" />
                <div className="h-2.5 w-2.5 rounded-[1px] bg-fly-orange opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm leading-relaxed text-[#ccc]">
                I confirm that this staff member has signed the <a href="#" className="font-bold text-fly-orange hover:underline decoration-fly-orange underline-offset-2">FlyMenu Digital Employment Agreement</a> and safety protocols.
              </span>
            </label>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-center gap-4 border-t border-[#262626] bg-[#111] p-6 sm:justify-end">
            <Link href="/admin/staff" className="rounded-xl border border-transparent bg-transparent px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#222]">
              Cancel
            </Link>
            <button className="rounded-xl bg-fly-orange px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-orange-600 shadow-[0_8px_24px_rgba(249,115,22,0.2)]" type="submit">
              Confirm Registration
            </button>
          </footer>
        </form>
      </div>
    </AdminShell>
  );
}


