import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

/** Card with animated gradient border on hover. */
export function GlowCard({ children, className = "", hover = true }: GlowCardProps) {
  return (
    <div
      className={`group relative rounded-xl ${hover ? "hover-lift" : ""} ${className}`}
    >
      <div
        className={`absolute -inset-px rounded-xl bg-gradient-to-r from-fly-orange/0 via-fly-orange/40 to-fly-orange/0 opacity-0 transition-opacity duration-500 ${
          hover ? "group-hover:opacity-100" : ""
        } motion-reduce:opacity-0`}
        aria-hidden
      />
      <div className="relative rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]">{children}</div>
    </div>
  );
}
