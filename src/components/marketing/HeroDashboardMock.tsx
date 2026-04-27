"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion";

const floorStatuses = ["occupied", "vip", "dirty", "reserved", "occupied", "empty"] as const;
const revenueBars = [64, 52, 74, 92, 42, 68];

const statusClass: Record<(typeof floorStatuses)[number], string> = {
  occupied: "bg-[#0e5f3a] text-white",
  vip: "bg-[#3a3a3a] text-white",
  dirty: "bg-[#4f1f24] text-white",
  reserved: "bg-[#5a2b0d] text-white",
  empty: "bg-[#232323] text-[#777777]",
};

export function HeroDashboardMock() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setAnimate(true), reduced ? 0 : 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Reveal direction="left" delay={200} className="w-full lg:justify-self-end">
      <div className="hover-lift relative z-[1] w-full rounded-[9px] border border-[rgba(255,255,255,0.12)] bg-[rgba(37,37,37,0.90)] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-3 flex items-center gap-1">
          <span className="mr-auto h-[9px] w-[72px] rounded-full bg-[#3c3c3c]" />
          <i className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#22c55e] motion-reduce:animate-none" />
          <i className="h-[7px] w-[7px] rounded-full bg-[#ef4444]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <span className="min-h-[70px] rounded-[5px] bg-[#343434] animate-fade-in animate-delay-200 motion-reduce:animate-none" />
          <span className="min-h-[70px] rounded-[5px] bg-[#343434] animate-fade-in animate-delay-300 motion-reduce:animate-none" />
          <div className="col-span-2 min-h-[110px] rounded-[5px] bg-[#4a4038] p-3">
            <p className="m-0 text-[0.6rem] font-black uppercase tracking-wider text-[#a7a7a7]">Live floor · revenue</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {floorStatuses.map((status, index) => (
                <span
                  key={`${status}-${index}`}
                  className={`grid min-h-[36px] place-items-center rounded-[4px] text-[0.55rem] font-black uppercase transition-all duration-500 motion-reduce:transition-none ${statusClass[status]} ${
                    animate ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <div className="mt-3 flex h-12 items-end gap-1 border-t border-[#5a4a3a] pt-2">
              {revenueBars.map((bar, idx) => (
                <span
                  key={bar}
                  className={`flex-1 origin-bottom rounded-[3px] transition-all duration-700 ease-out motion-reduce:transition-none ${
                    idx === 3 ? "bg-fly-orange" : "bg-[#7c3f17]"
                  }`}
                  style={{
                    height: animate ? `${bar * 0.45}%` : "0%",
                    transitionDelay: `${300 + idx * 80}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
