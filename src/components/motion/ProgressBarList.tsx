"use client";

import { useEffect, useRef, useState } from "react";

export type ProgressBarItem = {
  id: string;
  label: string;
  value: string;
  percent: number;
};

type ProgressBarListProps = {
  items: readonly ProgressBarItem[];
  className?: string;
};

export function AnimatedBar({ percent, className = "" }: { percent: number; className?: string }) {
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
    <div ref={ref} className={`h-1.5 overflow-hidden rounded-full bg-[#2a2a2a] ${className}`}>
      <div
        className="h-full rounded-full bg-[#22c55e] transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ width: animate ? `${percent}%` : "0%" }}
      />
    </div>
  );
}

export function ProgressBarList({ items, className = "" }: ProgressBarListProps) {
  const ref = useRef<HTMLUListElement>(null);
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={ref} className={`list-none space-y-4 p-0 ${className}`}>
      {items.map((row, i) => (
        <li key={row.id}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[#bdbdbd]">{row.label}</span>
            <span className="font-bold text-white">{row.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#2a2a2a]">
            <div
              className="h-full rounded-full bg-fly-orange transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                width: animate ? `${row.percent}%` : "0%",
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
