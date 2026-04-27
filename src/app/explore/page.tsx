"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Filter,
  MapPin,
  Star,
  Play,
  ChevronLeft,
} from "lucide-react";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Reveal, Stagger } from "@/components/motion/Reveal";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  city: string;
  ratingAverage: number;
  priceRange: string;
  media: { url: string }[];
}

const filterCategories = [
  { label: "All", slug: "All" },
  { label: "Fine Dining", slug: "fine-dining" },
  { label: "Sushi", slug: "sushi" },
  { label: "Steakhouse", slug: "steakhouse" },
  { label: "Italian", slug: "italian" },
  { label: "French", slug: "french" },
  { label: "Vegan", slug: "vegan" },
];

const categories = [
  {
    name: "Fine Dining",
    slug: "fine-dining",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=80",
  },
  {
    name: "Pasta & Italian",
    slug: "italian",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200&q=80",
  },
  {
    name: "Seafood",
    slug: "seafood",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80",
  },
  {
    name: "Steaks & Grill",
    slug: "steakhouse",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=80",
  },
  {
    name: "Desserts",
    slug: "dessert",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80",
  },
  {
    name: "Cocktail Bars",
    slug: "bar",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=80",
  },
];

import { api } from "@/lib/api";

export default function ExplorePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const queryParams: Record<string, string> = {};
        if (activeCategory !== "All") {
          queryParams.cuisine = activeCategory;
        }

        const data = await api.get(
          `/restaurants?${new URLSearchParams(queryParams).toString()}`,
        );
        setRestaurants(data);

        // Also fetch real categories if possible
        try {
          const cats = await api.get("/restaurants/categories");
          if (cats && cats.length > 0) {
            // Update filterCategories dynamically if you want, but for now we'll keep the list and just verify data
          }
        } catch (e) {}
      } catch (err) {
        console.error("Failed to fetch explore restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [activeCategory]);

  if (loading) {
    return (
      <CustomerShell
        activeNav="Explore"
        searchPlaceholder="Search restaurants or cuisines..."
      >
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </CustomerShell>
    );
  }

  const featured = restaurants.slice(0, 3);
  const trending = restaurants;

  return (
    <CustomerShell
      activeNav="Explore"
      searchPlaceholder="Search restaurants, dishes, or cuisines"
    >
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&q=80"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0a0a0a]" />

        <div className="relative z-10 flex h-full flex-col justify-center px-8 lg:px-20">
          <Reveal blur>
            <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-fly-orange">
              Premium Dining Experience
            </span>
            <h1 className="mt-4 max-w-2xl text-[4.5rem] font-black leading-[1.1] tracking-tight text-white">
              Find your next <br />
              <span className="text-fly-orange">favorite meal</span>
            </h1>
            <p className="mt-6 max-w-lg text-[1.05rem] font-medium leading-relaxed text-[#cccccc]">
              Explore the finest culinary destinations curated for your taste.
              From street food gems to Michelin-star experiences, delivered at
              your speed.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <Link
                href="#restaurants"
                className="flex h-14 items-center justify-center rounded-xl bg-fly-orange px-10 text-[0.75rem] font-black uppercase tracking-widest text-white no-underline shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-transform hover:scale-105"
              >
                Explore Restaurants
              </Link>
              <button className="flex h-14 items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-8 text-[0.75rem] font-black uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/10">
                <Play className="h-4 w-4 fill-current" />
                How it works
              </button>
            </div>

            <div className="mt-16 flex items-center gap-12">
              {[
                {
                  label: "Restaurants",
                  val:
                    restaurants.length > 0
                      ? `${Math.floor(restaurants.length / 10) * 10}+`
                      : "2400+",
                },
                { label: "Daily Bookings", val: "12k+" },
                {
                  label: "User Rating",
                  val:
                    restaurants.length > 0
                      ? (
                          restaurants.reduce(
                            (acc, r) => acc + Number(r.ratingAverage || 0),
                            0,
                          ) / restaurants.length
                        ).toFixed(1)
                      : "4.9",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <strong className="block text-xl font-black text-fly-orange italic uppercase">
                    {stat.val}
                  </strong>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-8 py-20 lg:px-20">
        {/* Featured Restaurants */}
        <section id="restaurants" className="mt-12">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="m-0 text-2xl font-black text-white">
                Featured Restaurants
              </h2>
              <p className="mt-2 text-sm font-medium text-[#666666]">
                Top-rated dining destinations this week
              </p>

              {/* Categories */}
              <div className="mt-8">
                <Stagger className="flex flex-wrap gap-3" staggerMs={40}>
                  <button
                    onClick={() => setActiveCategory("All")}
                    className={`rounded-xl px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all ${
                      activeCategory === "All"
                        ? "bg-fly-orange text-white shadow-[0_4px_14px_rgba(249,115,22,0.2)]"
                        : "bg-[#141414] text-[#666] border border-[#262626] hover:text-white hover:border-[#444]"
                    }`}
                  >
                    All
                  </button>
                  {filterCategories.slice(1).map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`rounded-xl px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all ${
                        activeCategory === cat.slug
                          ? "bg-fly-orange text-white shadow-[0_4px_14px_rgba(249,115,22,0.2)]"
                          : "bg-[#141414] text-[#666] border border-[#262626] hover:text-white hover:border-[#444]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </Stagger>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] bg-[#141414] text-[#888888] transition-colors hover:border-[#444] hover:text-white">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] bg-[#141414] text-[#888888] transition-colors hover:border-[#444] hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <Stagger
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            staggerMs={100}
          >
            {featured.length > 0 ? (
              featured.map((r) => (
                <Reveal key={r.id} blur>
                  <Link
                    href={`/restaurants/${r.slug}`}
                    className="group block no-underline"
                  >
                    <article className="overflow-hidden rounded-[1.5rem] border border-[#262626] bg-[#111111] transition-all hover:border-fly-orange/30">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={
                            r.media?.[0]?.url ||
                            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
                          }
                          alt={r.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="rounded bg-[#eab308] px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-widest text-black">
                            Featured
                          </span>
                          <span className="rounded bg-[#22c55e] px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-widest text-white">
                            Open
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="m-0 text-xl font-bold text-white">
                            {r.name}
                          </h3>
                          <div className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-fly-orange border border-white/5">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[0.7rem] font-black">
                              {r.ratingAverage || "4.9"}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#666666]">
                          {r.cuisine} · {r.priceRange} · {r.city}
                        </p>
                        <Link
                          href={`/restaurants/${r.slug}/book`}
                          className="mt-6 block w-full rounded-xl bg-fly-orange py-3.5 text-center text-[0.7rem] font-black uppercase tracking-[0.2em] text-white no-underline transition-opacity hover:opacity-90"
                        >
                          Book a Table
                        </Link>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-[#666] font-bold uppercase tracking-widest">
                  No restaurants found in this category.
                </p>
              </div>
            )}
          </Stagger>
        </section>

        {/* Categories Section */}
        <section className="mt-32">
          <h2 className="text-center text-2xl font-black text-white uppercase tracking-widest italic">
            Browse by Category
          </h2>
          <Stagger
            className="mt-16 flex flex-wrap justify-center gap-12"
            staggerMs={60}
          >
            <div
              onClick={() => setActiveCategory("All")}
              className="group flex flex-col items-center gap-4 cursor-pointer"
            >
              <div
                className={`relative h-24 w-24 overflow-hidden rounded-full border-2 transition-all group-hover:scale-110 ${activeCategory === "All" ? "border-fly-orange" : "border-[#262626]"}`}
              >
                <div className="grid h-full w-full place-items-center bg-[#141414] text-[#666] group-hover:text-white transition-colors">
                  <span className="text-xs font-black uppercase tracking-widest">
                    All
                  </span>
                </div>
              </div>
              <span
                className={`text-[0.65rem] font-black uppercase tracking-widest transition-colors ${activeCategory === "All" ? "text-white" : "text-[#666666] group-hover:text-white"}`}
              >
                All
              </span>
            </div>
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setActiveCategory(cat.slug)}
                className="group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div
                  className={`relative h-24 w-24 overflow-hidden rounded-full border-2 transition-all group-hover:scale-110 ${activeCategory === cat.slug ? "border-fly-orange" : "border-[#262626]"}`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={`object-cover transition-all ${activeCategory === cat.slug ? "grayscale-0" : "grayscale group-hover:grayscale-0"}`}
                  />
                  <div
                    className={`absolute inset-0 transition-all ${activeCategory === cat.slug ? "bg-transparent" : "bg-black/20 group-hover:bg-transparent"}`}
                  />
                </div>
                <span
                  className={`text-[0.65rem] font-black uppercase tracking-widest transition-colors ${activeCategory === cat.slug ? "text-white" : "text-[#666666] group-hover:text-white"}`}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </Stagger>
        </section>

        {/* Effortless Steps */}
        <section className="mt-32 text-center">
          <Reveal>
            <h2 className="text-2xl font-black text-white">
              Effortless Fine Dining
            </h2>
            <p className="mt-2 text-sm font-medium text-[#666666]">
              Three steps to your next culinary memory
            </p>
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {[
              {
                step: 1,
                title: "Discover",
                text: "Browse our curated list of high-end restaurants and hidden culinary gems in your area.",
              },
              {
                step: 2,
                title: "Reserve",
                text: "Instant real-time booking. Select your guest count, date, and time with a single tap.",
              },
              {
                step: 3,
                title: "Experience",
                text: "Enjoy priority service and a premium dining experience tailored to your exact preferences.",
              },
            ].map((item) => (
              <Reveal key={item.step} blur delay={item.step * 100}>
                <div className="flex flex-col items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#241a14] bg-fly-orange/10 text-fly-orange font-black text-lg">
                    {item.step}
                  </div>
                  <h4 className="mt-6 text-sm font-black uppercase tracking-widest text-white">
                    {item.title}
                  </h4>
                  <p className="mt-4 max-w-[280px] text-center text-xs leading-relaxed text-[#666666]">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="mt-32">
          <div className="mb-12">
            <h2 className="m-0 text-2xl font-black text-white">
              Trending Near You
            </h2>
            <p className="mt-2 text-sm font-medium text-[#666666]">
              The most popular choices this week in Kigali
            </p>
          </div>

          <Stagger
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            staggerMs={100}
          >
            {trending.map((r) => (
              <Reveal key={r.id} direction="up">
                <Link
                  href={`/restaurants/${r.slug}`}
                  className="group block no-underline"
                >
                  <article className="overflow-hidden rounded-[1.5rem] border border-[#262626] bg-[#111111] p-4 transition-all hover:border-fly-orange/30">
                    <div className="relative aspect-[16/8] overflow-hidden rounded-xl">
                      <Image
                        src={
                          r.media?.[0]?.url ||
                          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
                        }
                        alt={r.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-4">
                        <h3 className="m-0 text-sm font-bold text-white truncate">
                          {r.name}
                        </h3>
                        <p className="mt-1 text-[0.6rem] font-black uppercase tracking-widest text-[#444444] truncate">
                          {r.cuisine.toUpperCase()}
                        </p>
                      </div>
                      <Link
                        href={`/restaurants/${r.slug}/book`}
                        className="rounded-lg border border-fly-orange/30 bg-fly-orange/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-widest text-fly-orange no-underline transition-colors hover:bg-fly-orange hover:text-white shrink-0"
                      >
                        Book Now
                      </Link>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </Stagger>
        </section>

        {/* Testimonials */}
        <section className="mt-32">
          <h2 className="text-center text-2xl font-black text-white italic uppercase tracking-widest">
            What Our Diners Say
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                q: "FlyMenu has completely transformed how we discover restaurants. The premium selection is unmatched and the booking process is seamless.",
                a: "Sarah J.",
                r: "Verified Member",
              },
              {
                q: "The curated experiences and the level of service at the restaurants listed are simply exceptional. Truly a high-end experience.",
                a: "Michael R.",
                r: "Food Critic",
              },
              {
                q: "Finally a platform that understands luxury dining. The UI is as beautiful as the food we're ordering. Highly recommended!",
                a: "Elena K.",
                r: "Business Traveler",
              },
            ].map((t) => (
              <article
                key={t.a}
                className="rounded-3xl border border-[#262626] bg-[#111111] p-10"
              >
                <p className="text-sm font-medium leading-relaxed text-[#888888]">
                  "{t.q}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#222]" />
                  <div>
                    <strong className="block text-sm text-white">{t.a}</strong>
                    <span className="text-[0.65rem] font-bold text-fly-orange">
                      {t.r}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </CustomerShell>
  );
}
