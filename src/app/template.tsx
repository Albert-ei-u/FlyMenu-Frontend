"use client";

import { PageEnter } from "@/components/motion/PageEnter";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
