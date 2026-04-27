"use client";

import { useState } from "react";

type FilterTabsProps = {
  tabs: readonly string[];
  defaultIndex?: number;
  variant?: "pill" | "segment";
  className?: string;
};

export function FilterTabs({
  tabs,
  defaultIndex = 0,
  variant = "pill",
  className = "",
}: FilterTabsProps) {
  const [active, setActive] = useState(defaultIndex);

  if (variant === "segment") {
    return (
      <div className={`flex rounded-lg border border-[#333333] p-0.5 ${className}`}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(i)}
            className={`relative rounded-md px-3 py-1.5 text-xs font-bold transition-all duration-300 ease-out motion-reduce:transition-none ${
              active === i ? "bg-[#2a2a2a] text-white shadow-sm" : "text-[#888888] hover:text-[#bdbdbd]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActive(i)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ease-out motion-reduce:transition-none ${
            active === i
              ? "scale-100 bg-fly-orange text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
              : "scale-[0.98] border border-[#333333] bg-transparent text-[#888888] hover:border-[#555555] hover:text-[#bdbdbd]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
