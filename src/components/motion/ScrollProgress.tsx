"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] w-full bg-transparent motion-reduce:hidden"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-fly-orange via-[#ffb690] to-fly-orange shadow-[0_0_12px_rgba(249,115,22,0.6)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
