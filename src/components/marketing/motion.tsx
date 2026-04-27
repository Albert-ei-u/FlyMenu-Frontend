"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxLayerProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export function ParallaxLayer({ children, className = "", speed = 0.35 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - window.innerHeight / 2) * speed * 0.08;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform motion-reduce:transform-none ${className}`}>
      {children}
    </div>
  );
}

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({ children, className = "", reverse = false, pauseOnHover = true }: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden={typeof children === "string"}
    >
      <div
        className={`flex w-max gap-4 motion-reduce:animate-none ${
          reverse ? "[animation-direction:reverse]" : ""
        } animate-marquee ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
