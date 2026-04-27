"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type PageEnterProps = {
  children: ReactNode;
  className?: string;
};

/** Fade + slight rise on each route change (used in app/template.tsx). */
export function PageEnter({ children, className = "" }: PageEnterProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={`animate-page-enter motion-reduce:animate-none ${className}`}
    >
      {children}
    </div>
  );
}
