"use client";

import Image from "next/image";
import {
  BarChart3,
  CalendarCheck,
  ChefHat,
  ClipboardList,
  Crown,
  Facebook,
  ForkKnife,
  Instagram,
  TrendingUp,
  Twitter,
  UsersRound,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GlowCard, Reveal, Stagger } from "@/components/motion";

const features = [
  {
    icon: ChefHat,
    title: "Menu Management",
    text: "Digitize your offerings with high-fidelity visuals and real-time inventory management.",
  },
  {
    icon: CalendarCheck,
    title: "Table Booking",
    text: "AI-optimized table allocations to maximize covers and minimize turnover friction.",
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    text: "A unified flow from customer click to kitchen line, ensuring precision in every order.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Analytics",
    text: "Bespoke dashboards tracking revenue velocity, guest retention, and item performance.",
  },
  {
    icon: UsersRound,
    title: "Client Management",
    text: "Build elite loyalty with deep-dive dining histories and automated tier rewards.",
  },
  {
    icon: Crown,
    title: "Premium Visibility",
    text: "Elevate your establishment with premium placement in the FlyMenu elite discovery network.",
  },
];

const stats = [
  { val: "2,400+", label: "Elite Venues" },
  { val: "$142M+", label: "Gross Volume" },
  { val: "4.9/5", label: "User Rating" },
  { val: "12k+", label: "Daily Covers" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const secondaryNavLinks = [{ label: "For Customers", href: "/forcustomers" }];

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function HomePage() {
  const [liveStats, setStats] = useState(stats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get("/analytics/dashboard");
        setStats([
          { val: `${data.totalRestaurants || 0}+`, label: "Active Venues" },
          {
            val: `$${(data.salesTotal / 1000).toFixed(1)}k+`,
            label: "Gross Volume",
          },
          { val: "4.9/5", label: "User Rating" },
          { val: `${data.totalOrders || 0}+`, label: "Daily Orders" },
        ]);
      } catch (e) {}
    };
    fetchStats();
  }, []);

  return (
    <main className="min-h-dvh bg-[#050505] text-fly-fog selection:bg-fly-orange/30">
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-8 max-md:px-4">
          <a className="flex items-center gap-3 no-underline group" href="/">
            <div className="relative h-10 w-10">
              <Image
                src="/flymenu-logo.png"
                alt="FlyMenu"
                fill
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase italic">
              FlyMenu
            </span>
          </a>

          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[0.7rem] font-bold text-[#888] no-underline transition-colors hover:text-fly-orange"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 lg:flex">
              {secondaryNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[0.7rem] font-bold text-[#888] no-underline transition-colors hover:text-fly-orange"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex gap-3 max-md:hidden">
              <a
                className="group relative overflow-hidden rounded-xl bg-fly-orange px-6 py-3 text-[0.75rem] font-black uppercase tracking-widest text-white no-underline shadow-[0_8px_24px_rgba(249,115,22,0.25)]"
                href="/restaurant/signup"
              >
                <span className="relative z-10">For Restaurants</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&q=80"
            alt="Elite Dining"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark Overlay for content readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-8 pt-40 pb-20 max-md:px-4 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="flex flex-col justify-center">
            <Reveal blur>
              <h1 className="m-0 text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[1.1] tracking-tight text-white">
                Discover. Book. <br />
                Dine. <span className="text-fly-orange">Manage.</span>
              </h1>
              <p className="mt-8 max-w-[500px] text-lg font-medium leading-relaxed text-white/80">
                FlyMenu is the bridge between culinary excellence and digital
                convenience, empowering restaurants with professional tools
                while giving diners a seamless way to discover their next
                favorite meal.
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <a
                  className="inline-flex h-14 items-center justify-center rounded-xl bg-fly-orange px-10 text-sm font-black uppercase tracking-widest text-white no-underline shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-transform hover:scale-105 active:scale-95"
                  href="/restaurant/signup"
                >
                  Restaurant Sign Up
                </a>
                <a
                  className="inline-flex h-14 items-center justify-center rounded-xl border border-white/20 bg-black/20 px-10 text-sm font-black uppercase tracking-widest text-white no-underline backdrop-blur-md transition-colors hover:bg-white/10"
                  href="/forcustomers"
                >
                  Explore Restaurants
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative mt-20 lg:mt-0 flex items-center justify-center">
            <Reveal direction="left" delay={200}>
              <div className="relative aspect-[1.4/1] w-full max-w-[600px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#1a1a1a]/80 p-1.5 backdrop-blur-md shadow-2xl">
                <div className="h-full w-full rounded-[2.3rem] bg-[#111] p-6 lg:p-10">
                  <div className="flex items-center justify-end gap-1.5 mb-8">
                    <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
                    <div className="h-2 w-2 rounded-full bg-fly-orange" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
                    <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
                  </div>
                  <div className="mt-4 h-48 rounded-2xl bg-white/5 border border-white/5" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 mx-auto max-w-[1440px] px-8 pb-10">
          <Stagger
            className="flex flex-wrap items-center gap-12 lg:gap-20"
            staggerMs={50}
          >
            {liveStats.map((stat) => (
              <div key={stat.label}>
                <strong className="block text-2xl font-black text-fly-orange italic uppercase">
                  {stat.val}
                </strong>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#666]">
                  {stat.label}
                </span>
              </div>
            ))}
          </Stagger>
        </div>

        {/* Dual Cards Section Overlaying the Hero Image */}
        <div className="relative z-10 mx-auto max-w-[1440px] px-8 pb-32 max-md:px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Reveal blur delay={300}>
              <article className="rounded-[2.5rem] border border-white/10 bg-[#111111]/95 p-12 backdrop-blur-xl transition-all hover:border-fly-orange/30">
                <div className="flex items-center gap-4 mb-8">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#241a14] text-fly-orange">
                    <UsersRound className="h-6 w-6" />
                  </div>
                  <h3 className="m-0 text-2xl font-black text-white">
                    For Food Lovers
                  </h3>
                </div>
                <ul className="mb-12 space-y-5 p-0 list-none">
                  {[
                    "Exclusive Table Access",
                    "Real-time Menu Previews",
                    "Personalized Dining Rewards",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-4 text-[1.05rem] font-medium text-white/70"
                    >
                      <ShieldCheck className="h-5 w-5 text-[#22c55e]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/forcustomers"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 text-sm font-black uppercase tracking-widest text-fly-orange no-underline transition-colors hover:bg-white/10 w-full"
                >
                  Start Dining
                </a>
              </article>
            </Reveal>

            <Reveal blur delay={400}>
              <article className="rounded-[2.5rem] border border-white/10 bg-[#111111]/95 p-12 backdrop-blur-xl transition-all hover:border-fly-orange/30">
                <div className="flex items-center gap-4 mb-8">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#241a14] text-fly-orange">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="m-0 text-2xl font-black text-white">
                    For Restaurant Owners
                  </h3>
                </div>
                <ul className="mb-12 space-y-5 p-0 list-none">
                  {[
                    "Precision Kitchen Management",
                    "High-fidelity Data Analytics",
                    "Automated Reservation Flow",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-4 text-[1.05rem] font-medium text-white/70"
                    >
                      <ShieldCheck className="h-5 w-5 text-[#22c55e]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/restaurant/signup"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-fly-orange px-10 text-sm font-black uppercase tracking-widest text-white no-underline transition-transform hover:scale-[1.02] active:scale-95 w-full shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
                >
                  Claim Your Kitchen
                </a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-black py-32 border-t border-white/5">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <Reveal className="text-center mb-16">
            <h2 className="m-0 text-3xl font-black tracking-tight text-white md:text-4xl">
              A Dashboard for Culinary Mastery
            </h2>
            <p className="mt-2 text-[#888] font-medium">
              Real-time control over every table and every plate.
            </p>
          </Reveal>
          <Reveal blur delay={100}>
            <div className="relative mt-12 w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0d0d0d] p-1 backdrop-blur-sm shadow-2xl lg:mt-20">
              <div className="rounded-[2.2rem] bg-[#111] p-8 lg:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-[#555]">
                      Log Ins
                    </span>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                    <span className="text-[0.6rem] font-bold text-[#888]">
                      System Online
                    </span>
                  </div>
                  <div className="h-6 w-12 rounded-full bg-[#222] p-1 flex justify-end">
                    <div className="h-4 w-4 rounded-full bg-[#444]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
                    <h5 className="m-0 mb-6 text-[0.6rem] font-black uppercase tracking-widest text-[#666]">
                      Floor Plan
                    </h5>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        "bg-[#22c55e]/20 text-[#22c55e]",
                        "bg-[#22c55e]/20 text-[#22c55e]",
                        "bg-red-500/20 text-red-500",
                        "bg-[#22c55e]/20 text-[#22c55e]",
                        "bg-fly-orange/20 text-fly-orange",
                        "bg-[#22c55e]/20 text-[#22c55e]",
                        "bg-[#22c55e]/20 text-[#22c55e]",
                        "bg-red-500/20 text-red-500",
                      ].map((style, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-md border border-white/5 ${style.split(" ")[0]} flex items-center justify-center text-[0.5rem] font-bold`}
                        >
                          T{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
                    <h5 className="m-0 mb-6 text-[0.6rem] font-black uppercase tracking-widest text-[#666]">
                      Revenue Plan
                    </h5>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 60, 45, 90, 75, 50, 65].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm transition-all duration-500"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 3 ? "#f97316" : "#2a1a14",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
                    <h5 className="m-0 mb-6 text-[0.6rem] font-black uppercase tracking-widest text-[#666]">
                      Top Sellers
                    </h5>
                    <div className="space-y-4">
                      {[
                        { label: "Wagyu Ribeye", val: 85 },
                        { label: "Truffle Pasta", val: 65 },
                        { label: "Lobster Tail", val: 45 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[0.55rem] font-bold text-[#888]">
                              {item.label}
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-[#222]">
                            <div
                              className="h-full rounded-full bg-fly-orange"
                              style={{ width: `${item.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-32 bg-[#050505]">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <Reveal className="text-center mb-20">
            <h2 className="m-0 text-3xl font-black tracking-tight text-white md:text-4xl">
              Featured Establishments
            </h2>
          </Reveal>

          <Stagger
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            staggerMs={100}
          >
            {[
              {
                name: "The Obsidian Grill",
                type: "Contemporary Steakhouse • Kigali",
                image:
                  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
                tag: "Editor's Choice",
              },
              {
                name: "Saku-to Japanese",
                type: "Omakase Experience • Tokyo",
                image:
                  "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80",
                tag: "Trending",
              },
              {
                name: "La Piazza",
                type: "Authentic Italian • Rome",
                image:
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
                tag: "New",
              },
            ].map((resto) => (
              <Reveal key={resto.name} blur>
                <article className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0d0d0d] transition-all hover:border-fly-orange/30">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={resto.image}
                      alt={resto.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 rounded-full bg-fly-orange/90 px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-white backdrop-blur-md">
                      {resto.tag}
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="m-0 text-xl font-bold text-white">
                      {resto.name}
                    </h4>
                    <p className="mt-2 text-sm text-[#666]">{resto.type}</p>
                    <button className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                      Book Now
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="how-it-works" className="py-32 bg-[#050505]">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <Reveal className="text-center mb-20">
            <h2 className="m-0 text-3xl font-black tracking-tight text-white md:text-4xl">
              Effortless Flow
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
            <div>
              <h3 className="text-fly-orange font-bold uppercase tracking-widest text-sm mb-10 text-center lg:text-left">
                For Guests
              </h3>
              <div className="space-y-12">
                {[
                  {
                    step: 1,
                    title: "Discovery",
                    text: "Browse curated elite establishments near you and find the perfect table for any occasion.",
                  },
                  {
                    step: 2,
                    title: "Booking",
                    text: "Secure seamless reservations with a single tap, elevating your next dining experience effortlessly.",
                  },
                  {
                    step: 3,
                    title: "Tracking",
                    text: "Monitor the position of your real-time table and order status to eliminate the wait flow.",
                  },
                ].map((item) => (
                  <Reveal
                    key={item.step}
                    direction="right"
                    className="flex gap-6"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fly-orange text-white font-black text-sm shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        {item.title}
                      </h4>
                      <p className="text-[#888] text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#22c55e] font-bold uppercase tracking-widest text-sm mb-10 text-center lg:text-left">
                For Owners
              </h3>
              <div className="space-y-12">
                {[
                  {
                    step: 1,
                    title: "Integration",
                    text: "Professional onboarding that digitizes your menu and floor plans into an exquisite immediate operation.",
                  },
                  {
                    step: 2,
                    title: "Automation",
                    text: "Intelligent table management, optimized staffing, and live orders that maximize your facility's revenue stream.",
                  },
                ].map((item) => (
                  <Reveal
                    key={item.step}
                    direction="left"
                    className="flex gap-6"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c55e] text-white font-black text-sm shadow-[0_4px_12px_rgba(34,197,94,0.3)]">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        {item.title}
                      </h4>
                      <p className="text-[#888] text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-32 bg-[#050505] border-t border-white/5"
      >
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <Stagger
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            staggerMs={80}
          >
            {features.map((f) => (
              <GlowCard
                key={f.title}
                className="p-10 group border-white/5 bg-white/[0.02]"
              >
                <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-fly-orange/10 text-fly-orange group-hover:scale-110 transition-transform">
                  <f.icon className="h-7 w-7" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{f.title}</h4>
                <p className="text-[#888] leading-relaxed text-sm">{f.text}</p>
              </GlowCard>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-32 bg-[#050505] border-t border-white/5">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <Reveal className="text-center mb-20">
            <h2 className="m-0 text-3xl font-black tracking-tight text-white md:text-4xl">
              Voices from the Pass
            </h2>
          </Reveal>

          <Stagger
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            staggerMs={100}
          >
            {[
              {
                quote:
                  "FlyMenu has not just seated guests; it has seated the biggest names in the city, with a level of precision we've never seen.",
                author: "Marco S.",
                role: "Executive Chef, La Place",
              },
              {
                quote:
                  "As a diner, the Discovery feature is unparalleled. I've found three new favorite spots this month alone.",
                author: "Sarah M.",
                role: "Platinum Diner",
              },
              {
                quote:
                  "The analytics suite finally gives me the clarity I need to scale my restaurant group efficiently.",
                author: "James L.",
                role: "Owner, Obsidian Group",
              },
            ].map((testimonial) => (
              <Reveal key={testimonial.author} blur>
                <article className="rounded-[2rem] border border-white/5 bg-[#0d0d0d] p-10 h-full flex flex-col justify-between">
                  <p className="text-[#a1a1aa] italic leading-relaxed text-lg mb-8">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <h5 className="m-0 text-white font-bold">
                      {testimonial.author}
                    </h5>
                    <p className="mt-1 text-sm text-[#666] font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="pricing" className="py-32 bg-black border-t border-white/5">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <Reveal className="text-center mb-20">
            <h2 className="m-0 text-3xl font-black tracking-tight text-white md:text-4xl">
              Scalable Plans
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-[900px] mx-auto">
            <Reveal blur>
              <GlowCard className="p-10 border-white/5 bg-white/[0.02]">
                <h3 className="text-white font-bold text-xl mb-2">Standard</h3>
                <p className="text-[#666] text-sm mb-8">
                  Refine your establishment booking and establish a digital
                  presence without upfront costs.
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white">Free</span>
                </div>
                <ul className="space-y-4 p-0 list-none mb-10">
                  {[
                    "Discovery Listing",
                    "Basic Attendance",
                    "Digital Menu",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#888]"
                    >
                      <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/restaurant/signup"
                  className="flex h-12 items-center justify-center rounded-xl border border-white/10 text-sm font-bold text-white no-underline hover:bg-white/5 transition-colors"
                >
                  Get Started
                </a>
              </GlowCard>
            </Reveal>

            <Reveal blur delay={100}>
              <GlowCard className="p-10 border-fly-orange/20 bg-fly-orange/[0.03] relative">
                <div className="absolute top-4 right-4 bg-fly-orange text-white text-[0.6rem] font-black uppercase px-3 py-1 rounded-full">
                  Recommended
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Premium Ops
                </h3>
                <p className="text-[#666] text-sm mb-8">
                  The ultimate power engine for establishments serious about
                  dominating their local market.
                </p>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$49</span>
                  <span className="text-[#666] text-sm">/mo</span>
                </div>
                <ul className="space-y-4 p-0 list-none mb-10">
                  {[
                    "Full Dashboard Access",
                    "Real-time Kitchen Sync",
                    "AI-Powered Analytics",
                    "Featured Discovery Rank",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#888]"
                    >
                      <ShieldCheck className="h-4 w-4 text-fly-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/restaurant/signup"
                  className="flex h-12 items-center justify-center rounded-xl bg-fly-orange text-sm font-bold text-white no-underline hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(249,115,22,0.3)]"
                >
                  Start Free Trial
                </a>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-32 bg-[#0a0a0a] border-t border-white/5">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4 text-center">
          <Reveal>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl mb-6">
              Ready to elevate your <br /> culinary game?
            </h2>
            <p className="text-[#888] mb-12 max-w-[600px] mx-auto">
              Join thousands of restaurants and food lovers already using
              FlyMenu.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/restaurant/signup"
                className="h-14 px-10 flex items-center justify-center rounded-2xl bg-fly-orange text-sm font-black uppercase tracking-widest text-white no-underline shadow-[0_8px_32px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform"
              >
                Register Restaurant
              </a>
              <a
                href="/signup"
                className="h-14 px-10 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-black uppercase tracking-widest text-white no-underline hover:bg-white/10 transition-colors"
              >
                Join as Guest
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-black py-20 border-t border-white/5">
        <div className="mx-auto max-w-[1440px] px-8 max-md:px-4">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <a className="flex items-center gap-3 no-underline mb-6" href="/">
                <Image
                  src="/flymenu-logo.png"
                  alt="FlyMenu"
                  width={32}
                  height={32}
                />
                <span className="text-lg font-black tracking-tight text-white uppercase italic">
                  FlyMenu
                </span>
              </a>
              <p className="text-sm text-[#666] leading-relaxed max-w-[300px]">
                Premium hospitality tools for the world's most advanced culinary
                management and discovery platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-6">Product</h4>
              <ul className="space-y-4 p-0 list-none text-sm text-[#666]">
                <li>
                  <a
                    href="#features"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#solutions"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#analytics"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-6">Company</h4>
              <ul className="space-y-4 p-0 list-none text-sm text-[#666]">
                <li>
                  <a
                    href="#about"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#press"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-6">Legal</h4>
              <ul className="space-y-4 p-0 list-none text-sm text-[#666]">
                <li>
                  <a
                    href="#privacy"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#cookie"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#safety"
                    className="no-underline hover:text-fly-orange transition-colors"
                  >
                    Safety
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center">
            <p className="text-[0.7rem] text-[#444] font-bold uppercase tracking-widest">
              © 2026 FlyMenu. Precision in every plate.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
