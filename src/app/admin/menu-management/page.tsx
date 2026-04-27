"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  Edit3,
  Grid2X2,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatedMetric, Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  adminPageTitleH1,
  adminPageTitleP,
  mobileFilter,
} from "@/components/admin/admin-ui";

import { api } from "@/lib/api";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  isLive: boolean;
  category: { name: string };
  media: Array<{ url: string }>;
}

interface Category {
  id: string;
  name: string;
}

export default function MenuManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Items"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/restaurant/login");
        return;
      }

      try {
        const [itemsData, catsData] = await Promise.all([
          api.get("/menu/items"),
          api.get("/menu/categories"),
        ]);

        setItems(itemsData);
        setCategories(["All Items", ...catsData.map((c: any) => c.name)]);
      } catch (err: any) {
        console.error("Failed to fetch menu data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <AdminShell active="Menu Management">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  const processedItems = items.map((item) => {
    const media = item.media.map((m) => {
      let url = m.url;
      if (!url.startsWith("http")) {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
          "http://localhost:4000";
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        url = `${baseUrl}${cleanPath}`;
      }
      return { ...m, url };
    });
    return { ...item, media };
  });

  const filteredItems =
    activeTab === 0
      ? processedItems
      : processedItems.filter(
          (item) =>
            item.category?.name.toLowerCase() ===
            categories[activeTab].toLowerCase(),
        );

  const handleToggleLive = async (itemId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/menu/items/${itemId}`, { isLive: !currentStatus });
      // Refresh items
      const itemsData = await api.get("/menu/items");
      setItems(itemsData);
    } catch (err) {
      console.error("Failed to toggle live status");
    }
  };

  const stats = [
    { label: "Total Items", value: processedItems.length, icon: Archive },
    {
      label: "Active Categories",
      value: categories.length - 1,
      icon: Grid2X2,
    },
    {
      label: "Low Stock Alerts",
      value: processedItems.filter((i) => i.status === "UNAVAILABLE").length,
      icon: AlertTriangle,
      danger: processedItems.some((i) => i.status === "UNAVAILABLE"),
    },
  ];

  return (
    <AdminShell active="Menu Management">
      <div className={adminContent}>
        <Reveal blur>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className={adminPageTitleH1}>Menu Management</h1>
              <p className={adminPageTitleP}>
                Configure your digital storefront and item availability.
              </p>
            </div>
            <Link
              href="/admin/menu-management/new"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-fly-orange px-6 font-bold text-white transition-transform hover:scale-105 shadow-[0_8px_24px_rgba(249,115,22,0.2)]"
            >
              <Plus className="h-5 w-5" />
              Add New Item
            </Link>
          </div>
        </Reveal>

        <Reveal blur delay={100}>
          <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl bg-[#111111] p-1.5 w-fit border border-[#262626]">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === i
                    ? "bg-fly-orange text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)]"
                    : "text-[#666] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <Stagger
          className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          staggerMs={40}
        >
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className={`${adminCard} group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#262626] rounded-3xl bg-[#111111]`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {item.media && item.media[0] ? (
                  item.media[0].url.includes("localhost:4000") ? (
                    <img
                      src={item.media[0].url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <Image
                      src={item.media[0].url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a] text-[#333]">
                    <Archive className="h-10 w-10" />
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <span className="rounded-lg bg-black/40 backdrop-blur-md px-3 py-1 text-[0.6rem] font-black uppercase tracking-wider text-white border border-white/10">
                    {item.category.name}
                  </span>
                </div>

                <Link
                  href={`/admin/menu-management/${item.id}`}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-fly-orange hover:border-fly-orange"
                  aria-label="Edit item"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>

                {item.status === "UNAVAILABLE" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <span className="rounded-xl bg-red-600 px-4 py-2 text-[0.7rem] font-black uppercase tracking-widest text-white shadow-xl border border-red-500/50">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-black text-white group-hover:text-fly-orange transition-colors tracking-tight">
                    {item.name}
                  </h3>
                  <strong className="text-lg font-black text-fly-orange whitespace-nowrap">
                    ${Number(item.price).toFixed(2)}
                  </strong>
                </div>

                <p className="mb-8 line-clamp-2 flex-1 text-[0.8rem] leading-relaxed text-[#777]">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#222] pt-5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${item.status === "AVAILABLE" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-[#333]"}`}
                    />
                    <span
                      className={`text-[0.65rem] font-black uppercase tracking-widest ${item.status === "AVAILABLE" ? "text-green-500" : "text-[#444]"}`}
                    >
                      {item.status === "AVAILABLE"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <div
                    onClick={() => handleToggleLive(item.id, item.isLive)}
                    className={`relative h-6 w-11 rounded-full cursor-pointer transition-all duration-300 ${item.isLive ? "bg-fly-orange" : "bg-[#222]"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${item.isLive ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </Stagger>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          staggerMs={80}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            if (stat.danger) {
              return (
                <article
                  key={stat.label}
                  className={`${adminCard} flex items-center justify-between p-6`}
                >
                  <div>
                    <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
                      {stat.label}
                    </span>
                    <AnimatedMetric
                      value={stat.value}
                      className="mt-2 block text-3xl font-black text-white"
                    />
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ef4444]/10">
                    <Icon className="h-5 w-5 text-[#ef4444]" />
                  </div>
                </article>
              );
            }
            return (
              <article
                key={stat.label}
                className={`${adminCard} flex items-center justify-between p-6`}
              >
                <div>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
                    {stat.label}
                  </span>
                  <AnimatedMetric
                    value={stat.value}
                    className="mt-2 block text-3xl font-black text-white"
                  />
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-fly-orange/10">
                  <Icon className="h-5 w-5 text-fly-orange" />
                </div>
              </article>
            );
          })}
        </Stagger>
      </div>

      <button type="button" className={mobileFilter} aria-label="Menu controls">
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </AdminShell>
  );
}
