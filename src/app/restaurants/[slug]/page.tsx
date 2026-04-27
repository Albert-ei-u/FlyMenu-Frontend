"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  ParkingCircle,
  Phone,
  Share2,
  Star,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Reveal } from "@/components/motion/Reveal";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  ratingAverage: number;
  ratingCount: number;
  priceRange: string;
  media: { url: string }[];
  categories: MenuCategory[];
  settings: any;
}

import { api } from "@/lib/api";

export default function DynamicRestaurantProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart, total } = useCart();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [partySize, setPartySize] = useState(4);
  const [selectedTime, setSelectedTime] = useState("20:00");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Try exact slug first, then fallback to lowercase search
        let data;
        try {
          data = await api.get(`/restaurants/${slug}`);
        } catch (err) {
          // If not found, try searching for the restaurant by slug in the list
          const list = await api.get("/restaurants");
          const found = list.find(
            (r: any) => r.slug.toLowerCase() === slug.toLowerCase(),
          );
          if (found) {
            data = await api.get(`/restaurants/${found.slug}`);
          } else {
            throw err;
          }
        }

        if (data) {
          setRestaurant(data);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slug]);

  const handleAddToCart = (item: MenuItem) => {
    if (!restaurant) return;
    addToCart(
      {
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        unitPrice: item.price,
      },
      restaurant.id,
    );
  };

  if (loading) {
    return (
      <CustomerShell activeNav="Explore">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </CustomerShell>
    );
  }

  if (!restaurant) {
    return (
      <CustomerShell activeNav="Explore">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-black text-white">
            Restaurant Not Found
          </h1>
          <p className="mt-4 text-[#888]">
            The culinary destination you're looking for doesn't exist.
          </p>
          <Link
            href="/explore"
            className="mt-8 rounded-xl bg-fly-orange px-8 py-3 font-bold text-white no-underline"
          >
            Back to Discovery
          </Link>
        </div>
      </CustomerShell>
    );
  }

  const r = restaurant;
  const heroImage =
    r.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80";

  return (
    <CustomerShell
      activeNav="Explore"
      searchPlaceholder={`Search in ${r.name}...`}
    >
      {/* Hero */}
      <section className="relative h-[480px] overflow-hidden">
        <Image
          src={heroImage}
          alt={r.name}
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6 px-8 pb-12">
            <Reveal blur>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#22c55e] px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-white shadow-lg">
                    Open Now
                  </span>
                  <div className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-fly-orange backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-black text-white">
                      {r.ratingAverage || "4.9"}
                    </span>
                  </div>
                </div>
                <h1 className="m-0 text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight text-white uppercase italic">
                  {r.name}
                </h1>
                <p className="flex flex-wrap items-center gap-4 text-[0.95rem] font-medium text-[#cccccc]">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-fly-orange" />
                    {r.city}, {r.country}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4.5 w-4.5 text-fly-orange" />
                    {r.cuisine}
                  </span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={200} direction="left">
              <div className="flex gap-3">
                <Link
                  href={`/restaurants/${r.slug}/book`}
                  className="inline-flex h-14 items-center gap-3 rounded-xl bg-fly-orange px-8 text-[0.85rem] font-black uppercase tracking-widest text-white no-underline shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-transform hover:scale-105 active:scale-95"
                >
                  <Calendar className="h-5 w-5" />
                  Book Table
                </Link>
                <button className="grid h-14 w-14 place-items-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition-colors hover:bg-white/10">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="border-b border-white/5 bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-8 py-8 md:grid-cols-4">
          {[
            {
              icon: Clock,
              label: "Operating Hours",
              value: "11:00 AM - 11:00 PM",
            },
            { icon: Users, label: "Daily Capacity", value: "250+ Guests" },
            { icon: Wallet, label: "Pricing", value: r.priceRange },
            { icon: ParkingCircle, label: "Services", value: "Valet Parking" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/5 bg-[#141414] p-5 transition-colors hover:border-fly-orange/20"
            >
              <item.icon className="h-5 w-5 text-fly-orange" />
              <p className="mt-3 m-0 text-[0.65rem] font-black uppercase tracking-widest text-[#555555]">
                {item.label}
              </p>
              <strong className="mt-1 block text-sm font-bold text-white">
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1280px] gap-12 px-8 py-16 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Menu Sections */}
          <div className="flex flex-wrap gap-8 border-b border-white/5 pb-4">
            {r.categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryIndex(i)}
                className={`relative pb-4 text-[0.8rem] font-black uppercase tracking-[0.2em] transition-colors ${
                  activeCategoryIndex === i
                    ? "text-fly-orange"
                    : "text-[#555555] hover:text-[#888]"
                }`}
              >
                {cat.name}
                {activeCategoryIndex === i && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-fly-orange shadow-[0_0_12px_#f97316]" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 space-y-12">
            {r.categories[activeCategoryIndex]?.items.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {r.categories[activeCategoryIndex].items.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#111111] p-5 transition-all hover:border-fly-orange/20"
                  >
                    <div className="flex gap-5">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=80"
                          }
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <h3 className="m-0 text-lg font-bold text-white group-hover:text-fly-orange transition-colors">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#666666] line-clamp-2">
                            {item.description ||
                              "Premium ingredients prepared with culinary precision."}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-black text-white">
                            ${Number(item.price || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="rounded-lg bg-fly-orange/10 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-fly-orange transition-colors hover:bg-fly-orange hover:text-white"
                          >
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-20 text-center">
                <UtensilsCrossed className="mx-auto h-12 w-12 text-[#222]" />
                <p className="mt-4 text-[#444] font-bold uppercase tracking-widest text-sm">
                  No items in this category yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="rounded-2xl border border-white/5 bg-[#141414] p-8 shadow-2xl">
            <h2 className="m-0 text-xl font-black text-white uppercase italic">
              Reserve a Table
            </h2>
            <p className="mt-2 text-sm font-medium text-[#666666]">
              Secure your spot for an elite dining experience.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#444444]">
                  Guest Count
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[2, 4, 6, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPartySize(n)}
                      className={`h-11 w-11 rounded-xl text-sm font-bold transition-all ${
                        partySize === n
                          ? "bg-fly-orange text-white shadow-lg"
                          : "border border-white/5 bg-white/5 text-[#888888] hover:border-white/20"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#444444]">
                  Preferred Time
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`h-11 rounded-xl text-xs font-bold transition-all ${
                          selectedTime === t
                            ? "border border-fly-orange text-fly-orange bg-fly-orange/5"
                            : "border border-white/5 bg-white/5 text-[#888888] hover:border-white/20"
                        }`}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/restaurants/${r.slug}/book`}
              className="mt-8 block w-full rounded-xl bg-fly-orange py-4 text-center text-[0.75rem] font-black uppercase tracking-[0.2em] text-white no-underline shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-transform hover:scale-[1.02]"
            >
              Continue to Booking
            </Link>
            <p className="mt-4 text-center text-[0.6rem] font-bold uppercase tracking-widest text-[#444444]">
              No reservation fee required
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141414] p-8">
            <h3 className="m-0 text-sm font-black uppercase tracking-widest text-white">
              Contact & Location
            </h3>
            <div className="mt-6 space-y-5">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 shrink-0 text-fly-orange" />
                <p className="m-0 text-sm font-medium text-[#888888]">
                  {r.address || `${r.city}, ${r.country}`}
                </p>
              </div>
              <div className="flex gap-4">
                <Phone className="h-5 w-5 shrink-0 text-fly-orange" />
                <p className="m-0 text-sm font-medium text-[#888888]">
                  {r.phone || "Not provided"}
                </p>
              </div>
              <div className="flex gap-4">
                <UtensilsCrossed className="h-5 w-5 shrink-0 text-fly-orange" />
                <p className="m-0 text-sm font-medium text-[#888888]">
                  {r.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 w-[calc(100%-40px)] max-w-[600px] -translate-x-1/2">
          <Reveal direction="up">
            <div className="flex items-center justify-between rounded-[2rem] bg-white px-8 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div>
                <p className="m-0 text-[0.65rem] font-black uppercase tracking-widest text-[#999999]">
                  {cart.length} {cart.length === 1 ? "Item" : "Items"} ready to
                  order
                </p>
                <strong className="text-2xl font-black text-black">
                  ${total.toFixed(2)}
                </strong>
              </div>
              <Link
                href="/checkout"
                className="rounded-2xl bg-fly-orange px-10 py-4 text-[0.75rem] font-black uppercase tracking-widest text-white no-underline shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-transform hover:scale-105 active:scale-95"
              >
                Checkout Now
              </Link>
            </div>
          </Reveal>
        </div>
      )}
    </CustomerShell>
  );
}
