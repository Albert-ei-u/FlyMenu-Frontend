"use client";

import Image from "next/image";
import { ChevronDown, Star } from "lucide-react";
import { Reveal, Stagger } from "@/components/motion";
import { Marquee } from "@/components/marketing/motion";

const reviews = Array.from({ length: 5 });

const foodStrip = [
  { src: "/banner-img-260x260.png", alt: "Hot drinks and pastries", className: "h-[88px] w-[92px]" },
  { src: "/big-pizza-1.png", alt: "Hot stone pizza", className: "h-[92px] w-[168px]" },
  { src: "/chicken-french.png", alt: "Crispy chicken and fries", className: "h-[88px] w-[142px]" },
  { src: "/food1.png", alt: "Healthy bowl", className: "h-[90px] w-[120px]" },
] as const;

const floatingDecor = [
  {
    className:
      "absolute right-[18%] top-[6%] h-[48px] w-[48px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff7b5c_0_24%,#d91010_24%_60%,#6f0a0a_60%_100%)] shadow-[0_6px_18px_rgba(216,16,16,0.4)] animate-float motion-reduce:animate-none",
    delay: "0ms",
  },
  {
    className:
      "absolute bottom-[14%] right-[6%] h-[44px] w-[68px] rounded-[60%_40%_60%_40%] bg-[linear-gradient(135deg,#67b642_0_60%,#4a8a2e_60%_100%)] shadow-[0_6px_16px_rgba(74,138,46,0.4)] [transform:rotate(18deg)] animate-float-slow motion-reduce:animate-none",
    delay: "400ms",
  },
  {
    className:
      "absolute bottom-[30%] left-[8%] h-[52px] w-[52px] rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff_0_18%,#e2c2ad_18%_55%,#8a5a4a_55%_100%)] shadow-[0_6px_18px_rgba(138,90,74,0.35)] animate-float motion-reduce:animate-none",
    delay: "800ms",
  },
  {
    className:
      "absolute right-[4%] top-[30%] h-[14px] w-[14px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#6f3a26_0_40%,#3a1d12_40%_100%)] shadow-[0_4px_10px_rgba(0,0,0,0.5)] animate-orbit-slow motion-reduce:animate-none",
    delay: "200ms",
  },
];

function FoodTile({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <figure className={`m-0 shrink-0 overflow-hidden rounded-[10px] border border-[#1c1c1c] bg-[#141414] shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105 hover:border-fly-orange/40 motion-reduce:transform-none ${className}`}>
      <Image src={src} alt={alt} width={168} height={92} className="h-full w-full object-cover" />
    </figure>
  );
}

export function ForCustomersPage() {
  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-[#0d0d0d] text-fly-fog">
      <header className="mx-auto flex w-full max-w-[1440px] shrink-0 flex-wrap items-center justify-between gap-3 px-5 py-4">
        <a className="flex items-center gap-3 no-underline" href="/">
          <Image
            src="/flymenu-logo.png"
            alt="FlyMenu logo"
            width={40}
            height={40}
            priority
            className="animate-pulse-glow drop-shadow-[0_0_18px_rgba(249,115,22,0.18)] motion-reduce:animate-none"
          />
          <span className="text-[1.35rem] font-extrabold tracking-[-0.01em] text-fly-fog">FlyMenu</span>
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          <a className="text-[1.02rem] font-semibold text-fly-orange no-underline" href="/">
            Home
          </a>
          <button type="button" className="inline-flex items-center gap-1 bg-transparent p-0 text-[1.02rem] font-semibold text-fly-fog">
            Menu <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <button type="button" className="inline-flex items-center gap-1 bg-transparent p-0 text-[1.02rem] font-semibold text-fly-fog">
            Solution <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <a className="text-[1.02rem] font-semibold text-fly-fog no-underline" href="#contact">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a className="hidden font-bold text-fly-fog no-underline transition-colors hover:text-fly-orange md:inline-flex" href="/login">
            Login
          </a>
          <a
            href="/signup"
            className="hover-lift inline-flex items-center justify-center rounded-full bg-fly-orange px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(249,115,22,0.32)] no-underline"
          >
            SignUp
          </a>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-8 px-5 pb-8 pt-2 lg:grid-cols-2 lg:pb-12">
        <div className="max-w-[560px]">
          <Reveal blur>
            <p className="m-0 text-[0.95rem] text-[#c5c5c5] [font-family:JetBrains_Mono,Fira_Code,Courier_New,monospace]">
              Enjoy your delicious food
            </p>
            <h1 className="mt-4 text-[clamp(2rem,4.8vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-[#f3f3f3]">
              Order Healthy
              <br />
              &amp; Fresh Food
              <br />
              <span className="text-fly-orange">Any Time</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/explore"
                className="hover-lift inline-flex items-center justify-center rounded-full border border-fly-orange bg-fly-orange px-7 py-2.5 text-sm font-extrabold text-white shadow-[0_18px_38px_rgba(249,115,22,0.28)] no-underline"
              >
                Order now
              </a>
              <a
                href="/explore"
                className="inline-flex items-center justify-center rounded-full border border-[#2a2a2a] bg-transparent px-7 py-2.5 text-sm font-extrabold text-[#bdbdbd] no-underline transition-colors hover:border-fly-orange hover:text-fly-orange"
              >
                See the Menu
              </a>
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex gap-1 text-[#fbbf24]" aria-label="5 out of 5 stars">
                {reviews.map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="m-0 text-[0.85rem] text-[#c5c5c5] [font-family:JetBrains_Mono,Fira_Code,Courier_New,monospace]">
                More than 2000+ 5-star Reviews
              </p>
            </div>
          </Reveal>

          <Reveal delay={280} className="mt-4 hidden sm:block">
            <Marquee className="max-w-[520px] py-2">
              {foodStrip.map((item) => (
                <FoodTile key={item.src} src={item.src} alt={item.alt} className={item.className} />
              ))}
            </Marquee>
          </Reveal>

          <Stagger className="mt-4 flex flex-wrap items-end gap-3 sm:hidden" staggerMs={80}>
            {foodStrip.slice(0, 3).map((item) => (
              <FoodTile key={item.src} src={item.src} alt={item.alt} className={item.className} />
            ))}
          </Stagger>
        </div>

        <Reveal direction="left" delay={150} className="relative flex items-center justify-center py-6 lg:py-0">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="h-[min(420px,70vw)] w-[min(420px,70vw)] animate-spin-slow rounded-full border border-dashed border-fly-orange/20 motion-reduce:animate-none" />
            <span className="absolute h-[min(340px,58vw)] w-[min(340px,58vw)] animate-spin-slow rounded-full border border-[#2a2a2a] [animation-direction:reverse] motion-reduce:animate-none" />
          </div>

          <div className="relative flex aspect-square w-[min(280px,70vw)] items-center justify-center overflow-hidden rounded-full border border-[#1d1d1d] bg-[#141414] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_0_60px_rgba(249,115,22,0.04)] lg:w-[min(420px,42vw)]">
            <Image
              src="/food1.png"
              alt="Delicious healthy plate of food"
              width={420}
              height={420}
              priority
              className="animate-float h-[88%] w-[88%] rounded-full object-cover drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)] motion-reduce:animate-none"
            />
          </div>

          {floatingDecor.map((d, i) => (
            <span key={i} className={`pointer-events-none ${d.className}`} style={{ animationDelay: d.delay }} />
          ))}
        </Reveal>
      </section>

      <Reveal delay={100} className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-4 lg:hidden">
        <Marquee>
          {foodStrip.map((item) => (
            <FoodTile key={`m-${item.src}`} src={item.src} alt={item.alt} className={item.className} />
          ))}
        </Marquee>
      </Reveal>
    </main>
  );
}
