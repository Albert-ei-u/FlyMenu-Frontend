"use client";

import type { ReactNode } from "react";
import { ScrollProgress } from "./ScrollProgress";

type MotionProviderProps = {
  children: ReactNode;
  showScrollProgress?: boolean;
};

export function MotionProvider({ children, showScrollProgress = true }: MotionProviderProps) {
  return (
    <>
      {showScrollProgress ? <ScrollProgress /> : null}
      {children}
    </>
  );
}
