"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListFilter, Plus, SlidersHorizontal, UsersRound } from "lucide-react";
import { AnimatedMetric, GlowCard, Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  adminPageTitleH1,
  adminPageTitleP,
  mobileFilter,
} from "@/components/admin/admin-ui";

interface StaffMember {
  id: string;
  role: string;
  status: string;
  efficiency: number;
  hoursWorked: number;
  user: {
    fullName: string;
    email: string;
  };
}

const roleColors: Record<string, string> = {
  CHEF: "border border-fly-orange/30 text-fly-orange bg-fly-orange/10",
  WAITER: "border border-[#d97706]/30 text-[#d97706] bg-[#d97706]/10",
  MANAGER: "border border-[#eab308]/30 text-[#eab308] bg-[#eab308]/10",
};

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/restaurant/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/v1/staff", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStaff(data);
        }
      } catch (err: any) {
        console.error("Failed to fetch staff:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [router]);

  if (loading) {
    return (
      <AdminShell active="Staff">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="Staff">
      <div className={adminContent}>
        <Reveal blur>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className={adminPageTitleH1}>Staff Management</h1>
              <p className={adminPageTitleP}>
                Oversee team performance and operational assignments.
              </p>
            </div>
            <Link
              href="/admin/staff/new"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-fly-orange px-6 font-bold text-white transition-transform hover:scale-105 shadow-[0_8px_24px_rgba(249,115,22,0.2)]"
            >
              <Plus className="h-5 w-5" />
              Add Staff Member
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3" staggerMs={90}>
          <GlowCard className="p-6">
            <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">Total Active Crew</small>
            <div className="mt-2 flex items-baseline justify-between">
              <AnimatedMetric value={staff.length} className="text-4xl font-black text-white" />
              <UsersRound className="h-8 w-8 text-[#333]" />
            </div>
          </GlowCard>
          <GlowCard className="p-6">
             <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">Avg Efficiency</small>
             <AnimatedMetric 
              value={staff.length > 0 ? staff.reduce((acc, s) => acc + s.efficiency, 0) / staff.length : 0} 
              suffix="%" 
              decimals={1} 
              className="mt-2 block text-4xl font-black text-white" 
             />
          </GlowCard>
          <GlowCard className="border-[#4a2411] bg-[#1f1408] p-6">
             <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">Active On Duty</small>
             <AnimatedMetric value={staff.filter(s => s.status === 'ACTIVE').length} className="mt-2 block text-4xl font-black text-white" />
          </GlowCard>
        </Stagger>

        <Reveal className="mt-6" delay={120}>
          <section className={`${adminCard} overflow-hidden p-6`}>
            <header className="mb-6 flex items-center justify-between">
              <h2 className="m-0 text-xl font-bold text-white tracking-wide">Employee Directory</h2>
              <div className="flex gap-4 text-[#888888]">
                <ListFilter className="h-5 w-5 cursor-pointer hover:text-white" />
                <SlidersHorizontal className="h-5 w-5 cursor-pointer hover:text-white" />
              </div>
            </header>

            <div className="overflow-x-auto">
              <div className="min-w-[768px]">
                <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr_0.8fr] gap-4 border-b border-[#262626] pb-4 text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
                  <span>Staff Member</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Efficiency</span>
                  <span>Hours Worked</span>
                </div>
                {staff.length === 0 ? (
                  <div className="p-10 text-center text-sm text-[#555]">
                    No staff members found.
                  </div>
                ) : (
                  staff.map((member, i) => (
                    <Reveal key={member.id} delay={i * 50} direction="up">
                      <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr_0.8fr] items-center gap-4 border-b border-[#262626]/50 py-5 text-sm last:border-0 hover:bg-[#141414]/50">
                        <span className="flex items-center gap-4">
                          <div className="h-10 w-10 overflow-hidden rounded-xl border border-[#333] bg-[#222] flex items-center justify-center text-[0.65rem] font-black text-[#888]">
                            {member.user.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>
                            <strong className="block font-bold text-white tracking-wide">{member.user.fullName}</strong>
                            <small className="block text-[0.7rem] font-medium text-[#666]">{member.user.email}</small>
                          </span>
                        </span>
                        <span>
                          <em className={`inline-flex rounded-md px-2.5 py-1 text-[0.65rem] font-black not-italic tracking-wider ${roleColors[member.role] || roleColors.CHEF}`}>
                            {member.role}
                          </em>
                        </span>
                        <span className="flex items-center gap-2">
                          <i className={`h-1.5 w-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                          <span className={`text-[0.7rem] font-bold uppercase tracking-widest ${member.status === 'ACTIVE' ? 'text-white' : 'text-[#666]'}`}>
                            {member.status.replace("_", " ")}
                          </span>
                        </span>
                        <div className="flex w-32 flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[0.65rem] font-bold text-[#888]">
                            <span>{member.efficiency}%</span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-[#262626]">
                            <div className="h-full rounded-full bg-fly-orange" style={{ width: `${member.efficiency}%` }} />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#888] tracking-widest">{member.hoursWorked.toFixed(1)} HRS</span>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            </div>

            <footer className="mt-6 flex items-center justify-between border-t border-[#262626] pt-6">
              <span className="text-xs font-medium text-[#666666]">Showing 4 of 42 employees</span>
              <div className="flex items-center gap-1">
                <button className="rounded border border-[#333] bg-[#141414] px-3 py-1.5 text-xs font-bold text-[#888] hover:bg-[#222]">Prev</button>
                <button className="rounded border border-fly-orange bg-fly-orange/10 px-3 py-1.5 text-xs font-bold text-fly-orange">1</button>
                <button className="rounded border border-[#333] bg-[#141414] px-3 py-1.5 text-xs font-bold text-[#888] hover:bg-[#222]">2</button>
                <button className="rounded border border-[#333] bg-[#141414] px-3 py-1.5 text-xs font-bold text-[#888] hover:bg-[#222]">3</button>
                <button className="rounded border border-[#333] bg-[#141414] px-3 py-1.5 text-xs font-bold text-[#888] hover:bg-[#222]">Next</button>
              </div>
            </footer>
          </section>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Reveal delay={160}>
            <article className={`${adminCard} p-6`}>
              <div className="flex items-center justify-between">
                <h2 className="m-0 text-lg font-bold text-white">Weekly Performance Trend</h2>
                <div className="flex items-center gap-4 text-[0.65rem] font-bold text-[#888]">
                  <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#fcd34d]"></i> Actual Efficiency</span>
                  <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#333]"></i> Target</span>
                </div>
              </div>
              <div className="mt-10 flex h-[200px] items-end justify-between gap-4 border-b border-[#262626] pb-0">
                {[50, 70, 85, 95, 60, 80, 85].map((bar, index) => (
                  <div key={index} className="flex h-full w-full flex-col justify-end">
                    <div
                      className={`w-full max-w-[50px] mx-auto rounded-t-sm transition-all duration-700 ${index === 3 ? "bg-[#5c728e] shadow-[0_-4px_0_0_#fcd34d]" : "bg-[#4a3219]"}`}
                      style={{ height: `${bar}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[0.65rem] font-bold uppercase tracking-wider text-[#555]">
                <span className="w-full text-center">Mon</span>
                <span className="w-full text-center">Tue</span>
                <span className="w-full text-center">Wed</span>
                <span className="w-full text-center">Thu</span>
                <span className="w-full text-center">Fri</span>
                <span className="w-full text-center">Sat</span>
                <span className="w-full text-center">Sun</span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={220}>
            <article className={`${adminCard} p-6 flex flex-col`}>
              <h2 className="m-0 text-lg font-bold text-white">Crew Distribution</h2>
              <div className="mt-8 flex-1 space-y-6">
                {[
                  ["Waitstaff", "18 / 20", 90, "bg-fly-orange"],
                  ["Culinary Crew", "12 / 12", 100, "bg-[#fcd34d]"],
                  ["Management", "4 / 5", 80, "bg-fly-orange"],
                  ["Logistics/Clean", "8 / 10", 80, "bg-[#666]"],
                ].map(([label, value, width, color]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-[#888] font-medium">{label}</span>
                      <b className="text-[#ccc] text-xs font-medium">{value}</b>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#262626]">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-8 w-full rounded-xl border border-[#333] bg-[#141414] py-4 text-sm font-bold text-white transition-colors hover:bg-[#222]">
                Adjust Shift Roster
              </button>
            </article>
          </Reveal>
        </div>
      </div>

      <button type="button" className={mobileFilter} aria-label="Staff controls">
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </AdminShell>
  );
}
