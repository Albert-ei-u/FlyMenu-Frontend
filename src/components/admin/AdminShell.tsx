"use client";

import { Bell, Search, LogOut, CheckCircle2 } from "lucide-react";
import { type ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_SIDEBAR_WIDTH,
  AdminSidebar,
  type AdminNavKey,
} from "./AdminSidebar";
import { useSocket } from "@/context/SocketContext";

type AdminShellProps = {
  active: AdminNavKey;
  children: ReactNode;
  searchPlaceholder?: string;
  shellClassName?: string;
};

export function AdminShell({
  active,
  children,
  searchPlaceholder = "Search menu items...",
  shellClassName = "",
}: AdminShellProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on("notifications:new", (notification: any) => {
      // Check if this notification is for this restaurant owner
      // In a real app, we'd use rooms or user IDs
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Basic browser notification or audio alert could go here
      if (notification.type === "ORDER") {
        alert(`New Order: ${notification.message}`);
      }
    });

    return () => {
      socket.off("notifications:new");
    };
  }, [socket]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/restaurant/login");
  };

  return (
    <div
      className={`flex min-h-dvh bg-[#0d0d0d] text-fly-fog ${shellClassName}`}
    >
      <AdminSidebar active={active} />

      <div className="flex min-h-dvh flex-col flex-1">
        <header className="sticky top-0 z-30 grid min-h-16 grid-cols-[minmax(240px,1fr)_auto_auto] items-center gap-7 border-b border-[#262626] bg-[rgba(13,13,13,0.92)] px-8 backdrop-blur-[18px] max-lg:grid-cols-1 max-lg:gap-4 max-lg:px-4 max-lg:py-4">
          <label className="flex w-full max-w-[280px] items-center gap-3 text-[#9a9a9a] max-lg:max-w-none">
            <Search className="h-5 w-5 shrink-0" />
            <input
              className="w-full border-0 bg-transparent text-fly-fog outline-0 placeholder:text-[#666666]"
              type="search"
              placeholder={searchPlaceholder}
            />
          </label>

          <nav className="flex gap-7 max-lg:justify-between">
            {["Analytics", "Reports", "Support"].map((link) => (
              <a
                key={link}
                className="text-sm text-[#a7a7a7] no-underline transition-colors hover:text-white"
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 max-lg:justify-between">
            <span className="rounded-full border border-[#284464] bg-[#101923] px-4 py-[0.55rem] text-[0.68rem] font-black uppercase tracking-[0.12em] text-fly-orange">
              System Status: Optimal
            </span>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setUnreadCount(0)}
              className="relative border-0 bg-transparent p-0 text-[#a7a7a7] transition-colors hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-fly-orange text-[0.6rem] font-bold text-white shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#284464] bg-[linear-gradient(145deg,#132437,#4f2515)] text-sm font-black text-white hover:opacity-90 transition-opacity"
              >
                A
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111111] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
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
        </header>

        <div className="flex-1 animate-fade-in motion-reduce:animate-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export { ADMIN_SIDEBAR_WIDTH };
export type { AdminNavKey };
