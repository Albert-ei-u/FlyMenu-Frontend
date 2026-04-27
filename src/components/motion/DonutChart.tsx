"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DonutSegment = { pct: number; color: string };

type DonutChartProps = {
  segments: readonly DonutSegment[];
  size?: number;
  holeSize?: number;
  center?: ReactNode;
  className?: string;
};

export function DonutChart({
  segments,
  size = 160,
  holeSize = 112,
  center,
  className = "",
}: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gradient = segments
    .map((s, i) => {
      const start = segments.slice(0, i).reduce((a, x) => a + x.pct, 0);
      return `${s.color} ${start}% ${start + s.pct}%`;
    })
    .join(", ");

  return (
    <div
      ref={ref}
      className={`relative grid shrink-0 place-items-center rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${gradient})`,
      }}
    >
      <div
        className="grid place-items-center rounded-full bg-[#1a1a1a] text-center"
        style={{ width: holeSize, height: holeSize }}
      >
        {center}
      </div>
    </div>
  );
}
