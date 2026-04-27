"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
  Children,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
};

const hiddenTransform: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  direction = "up",
  blur = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
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
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none ${
        visible
          ? "translate-x-0 translate-y-0 opacity-100 blur-0"
          : `opacity-0 ${blur ? "blur-sm" : "blur-0"} ${hiddenTransform[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  staggerMs?: number;
  direction?: RevealProps["direction"];
};

export function Stagger({
  children,
  className = "",
  itemClassName = "",
  staggerMs = 80,
  direction = "up",
}: StaggerProps) {
  const childrenArray = Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <Reveal
          key={index}
          delay={index * staggerMs}
          direction={direction}
          className={itemClassName}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}
