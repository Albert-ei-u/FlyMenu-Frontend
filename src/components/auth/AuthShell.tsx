import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};


export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative grid min-h-dvh grid-cols-1 overflow-hidden bg-[#0d0d0d] lg:grid-cols-[0.45fr_0.55fr]">
      <Image
        src="/tomato-shape-2.png"
        alt=""
        width={120}
        height={120}
        className="pointer-events-none absolute left-[-10px] top-[-10px] z-[2] h-[110px] w-[110px] animate-float object-contain motion-reduce:animate-none"
        aria-hidden="true"
        priority
      />
      <Image
        src="/patato-shape.png"
        alt=""
        width={180}
        height={180}
        className="pointer-events-none absolute bottom-[-10px] left-[-20px] z-[2] h-[170px] w-[180px] animate-float-slow object-contain motion-reduce:animate-none"
        aria-hidden="true"
      />

      <aside className="relative z-[1] flex flex-col items-center justify-center px-8 py-12 text-center max-lg:pb-6 max-lg:pt-10">
        <Image
          src="/flymenu-logo.png"
          alt="FlyMenu logo"
          width={80}
          height={80}
          className="h-20 w-20 animate-pulse-glow object-contain motion-reduce:animate-none"
          priority
        />
        <h1 className="mt-3 animate-fade-in-up text-[2rem] font-black tracking-[-0.01em] text-fly-orange animate-delay-100 [font-family:Georgia,Times_New_Roman,serif] motion-reduce:animate-none">
          FlyMenu
        </h1>
        <p className="mt-2 animate-fade-in-up text-[1.25rem] font-extrabold text-white animate-delay-200 [font-family:Georgia,Times_New_Roman,serif] motion-reduce:animate-none">
          Delicious&nbsp; <span>Meals</span>
        </p>
        <p className="mt-1 animate-fade-in-up text-[0.95rem] font-semibold text-[#a3a3a3] animate-delay-300 [font-family:Georgia,Times_New_Roman,serif] motion-reduce:animate-none">
          JoinUs
        </p>
      </aside>

      <div className="animate-fade-in-up animate-delay-200 motion-reduce:animate-none">{children}</div>
    </main>
  );
}
