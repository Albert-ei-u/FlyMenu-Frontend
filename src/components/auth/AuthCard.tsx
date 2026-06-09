import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type AuthCardProps = {
  backHref?: string;
  centered?: boolean;
  children: ReactNode;
};


export function AuthCard({
  backHref = "/",
  centered = false,
  children,
}: AuthCardProps) {
  return (
    <section
      className={[
        "relative z-[1] m-4 flex flex-col justify-center overflow-hidden rounded-[32px] border border-[#2a2a2a]/80 bg-[#1a1a1a] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
        "bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.10),transparent_16rem),radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.03),transparent_18rem)]",
        "animate-scale-in animate-delay-200 motion-reduce:animate-none",
        "lg:my-10 lg:ml-6 lg:mr-12 lg:rounded-[48px] lg:p-14",
        centered ? "items-center text-center" : "",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-fly-orange/10 blur-3xl motion-reduce:hidden"
        aria-hidden
      />
      <Link
        href={backHref}
        className="mb-6 grid h-[38px] w-[38px] place-items-center rounded-full border border-[#444444] bg-transparent text-fly-orange no-underline transition-all duration-300 hover:scale-105 hover:border-fly-orange hover:bg-[rgba(249,115,22,0.08)] motion-reduce:transform-none"
        aria-label="Go back"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <div className="animate-fade-in-up animate-delay-300 motion-reduce:animate-none">{children}</div>
    </section>
  );
}
