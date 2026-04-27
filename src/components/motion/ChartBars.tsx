"use client";

import { useEffect, useRef, useState } from "react";

export type ChartBarItem = { label: string; value: number };

type ChartBarsProps = {
  bars: readonly ChartBarItem[];
  className?: string;
  barClassName?: string;
};

export function ChartBars({ bars, className = "", barClassName = "" }: ChartBarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex items-end justify-between gap-1 border-b border-[#2a2a2a] pb-2 ${className}`}
    >
      {bars.map((bar) => (
        <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
          <span
            className={`w-full max-w-[20px] origin-bottom rounded-t bg-gradient-to-t from-fly-orange/40 to-fly-orange transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${barClassName}`}
            style={{ height: animate ? `${bar.value}%` : "0%" }}
          />
          <span className="text-[0.55rem] font-bold text-[#555555]">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}
