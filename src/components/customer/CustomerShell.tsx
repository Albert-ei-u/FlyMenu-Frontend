"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  MapPin,
  Search,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

export type CustomerNavKey = "Explore" | "My Bookings" | "History";

type CustomerShellProps = {
  children: ReactNode;
  activeNav?: CustomerNavKey;
  searchPlaceholder?: string;
  showFooter?: boolean;
};

const navLinks: Array<{ label: CustomerNavKey; href: string }> = [
  { label: "Explore", href: "/explore" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "History", href: "/orders/tracking" },
];

export function CustomerHeader({
  activeNav = "Explore",
  searchPlaceholder = "Search restaurants, dishes, or cuisines",
}: {
  activeNav?: CustomerNavKey;
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 animate-fade-in border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-md motion-reduce:animate-none">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-4 px-5 py-4 lg:px-8">
        <Link
          href="/explore"
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <Image
            src="/flymenu-logo.png"
            alt=""
            width={36}
            height={36}
            priority
          />
          <span className="text-xl font-black text-fly-orange italic uppercase">
            FlyMenu
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Customer"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[0.7rem] font-bold uppercase tracking-widest no-underline transition-colors duration-200 ${
                activeNav === link.label
                  ? "text-fly-orange"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center gap-3 lg:max-w-2xl lg:ml-8">
          <label className="flex h-11 flex-1 items-center gap-3 rounded-full border border-[#2a2a2a] bg-[#141414] px-4">
            <Search className="h-4 w-4 shrink-0 text-[#666666]" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full border-0 bg-transparent text-[0.8rem] text-white outline-0 placeholder:text-[#444444]"
            />
          </label>
          <div className="hidden items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-4 h-11 sm:flex">
            <MapPin className="h-3.5 w-3.5 text-fly-orange" />
            <span className="text-[0.75rem] font-bold text-[#888888] whitespace-nowrap">
              Kigali, Rwanda
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] bg-[#141414] text-[#888888] hover:text-white transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-fly-orange border-2 border-[#0a0a0a]" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 rounded-full border border-[#2a2a2a] bg-[#141414] p-1.5 pr-4 hover:border-[#333] transition-colors"
            >
              <div className="h-7 w-7 overflow-hidden rounded-full bg-[#222]">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                  alt="Profile"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <span className="text-[0.75rem] font-bold text-white hidden sm:inline">
                Profile
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111111] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <Link
                  href="/customers/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-[#a7a7a7] no-underline transition-colors hover:bg-[#1a1a1a] hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="mx-4 h-px bg-[#222222]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-[#a7a7a7] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function CustomerFooter() {
  return (
    <footer className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link
            href="/explore"
            className="flex items-center gap-2 no-underline"
          >
            <Image src="/flymenu-logo.png" alt="" width={28} height={28} />
            <span className="text-lg font-black text-fly-orange">FlyMenu</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#888888]">
            Elevating your culinary journey through high-performance luxury
            dining experiences.
          </p>
        </div>
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-wider text-[#666666]">
            Company
          </p>
          <nav className="mt-3 flex flex-col gap-2">
            {["About Us", "Careers", "Press"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm text-[#bdbdbd] no-underline hover:text-fly-orange"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-wider text-[#666666]">
            Legal & Help
          </p>
          <nav className="mt-3 flex flex-col gap-2">
            {["Privacy Policy", "Terms of Service", "Help Center"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm text-[#bdbdbd] no-underline hover:text-fly-orange"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-wider text-[#666666]">
            Support
          </p>
          <nav className="mt-3 flex flex-col gap-2">
            {["Contact Support", "Partner Login"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm text-[#bdbdbd] no-underline hover:text-fly-orange"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-[#1f1f1f] px-5 py-4 text-center text-xs text-[#555555] lg:text-right">
        © 2024 FlyMenu Platform. All rights reserved.
      </div>
    </footer>
  );
}

export function CustomerShell({
  children,
  activeNav,
  searchPlaceholder,
  showFooter = true,
}: CustomerShellProps) {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-fly-fog">
      <CustomerHeader
        activeNav={activeNav}
        searchPlaceholder={searchPlaceholder}
      />
      <main>{children}</main>
      {showFooter ? <CustomerFooter /> : null}
    </div>
  );
}
