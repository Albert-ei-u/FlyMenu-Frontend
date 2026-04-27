import Image from "next/image";

type PlatformFooterProps = {
  variant?: "default" | "compact";
};

export function PlatformFooter({ variant = "default" }: PlatformFooterProps) {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 py-10 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#222] sm:flex-row">
      <div className="flex items-center gap-3">
        <Image src="/flymenu-logo.png" alt="" width={18} height={18} className="opacity-20" />
        <span>FlyMenu Platform</span>
        <span className="hidden sm:inline opacity-50">/</span>
        <span className="opacity-50">© 2024 Executive Node</span>
      </div>
      <nav className="flex flex-wrap justify-center gap-8">
        <a className="text-[#222] no-underline hover:text-fly-orange transition-colors" href="#">Legal</a>
        <a className="text-[#222] no-underline hover:text-fly-orange transition-colors" href="#">SLA</a>
        <a className="text-[#222] no-underline hover:text-fly-orange transition-colors" href="#">Support</a>
      </nav>
    </footer>
  );
}
