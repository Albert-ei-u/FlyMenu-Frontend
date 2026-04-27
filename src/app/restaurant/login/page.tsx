"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Apple, ArrowRight, Lock, Mail } from "lucide-react";

import { api } from "@/lib/api";

export default function RestaurantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.post("/auth/login", { email, password });

      // Store token
      localStorage.setItem("token", data.accessToken);
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400`;

      // Redirect based on role
      if (data.user.role === "RESTAURANT_OWNER" || data.user.role === "MANAGER") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "SUPER_ADMIN") {
        router.push("/platform/dashboard");
      } else {
        router.push("/explore");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#0f0f0f] text-white lg:grid lg:grid-cols-[0.47fr_0.53fr]">
      <section className="grid content-start gap-6 bg-[radial-gradient(circle_at_70%_0,rgba(249,115,22,0.16),transparent_40%),linear-gradient(160deg,#1b130f,#0f0f0f_58%)] p-6 lg:p-10">
        <header className="flex items-center gap-3">
          <Image src="/flymenu-logo.png" alt="FlyMenu logo" width={44} height={44} priority />
          <div>
            <strong className="block text-[1.15rem] leading-none">FlyMenu</strong>
            <small className="block text-[0.62rem] tracking-[0.14em] text-[#8f8f8f]">EXECUTIVE PANEL</small>
          </div>
        </header>

        <h1 className="mt-2 max-w-[560px] text-[clamp(1.8rem,3.3vw,2.8rem)] font-bold leading-[1.12]">
          Experience the future of restaurant management
        </h1>

        <div className="grid gap-3">
          <div className="flex" aria-hidden="true">
            {["AM", "LC", "JV"].map((x, idx) => (
              <span
                key={x}
                className={[
                  "grid h-8 w-8 place-items-center rounded-full border border-[#2a2a2a] bg-[#1b1b1b] text-[0.62rem] font-black text-[#d8d8d8]",
                  idx === 0 ? "" : "-ml-2",
                ].join(" ")}
              >
                {x}
              </span>
            ))}
          </div>
          <p className="m-0 max-w-[430px] text-[0.85rem] leading-[1.55] text-[#a3a3a3]">
            Join over 2,500+ premium establishments optimizing their operations with our platform.
          </p>
        </div>

        <div className="mt-auto grid max-w-[430px] grid-cols-2 gap-4 pt-2">
          <article>
            <strong className="block text-[1.35rem]">99.9%</strong>
            <small className="block text-[0.65rem] tracking-[0.12em] text-[#8f8f8f]">SYSTEM UPTIME</small>
          </article>
          <article>
            <strong className="block text-[1.35rem]">24/7</strong>
            <small className="block text-[0.65rem] tracking-[0.12em] text-[#8f8f8f]">EXECUTIVE SUPPORT</small>
          </article>
        </div>
      </section>

      <section className="grid place-items-center bg-[#101010] p-6 lg:p-10">
        <div className="w-full max-w-[560px]">
          <h2 className="m-0 text-[clamp(1.65rem,2.6vw,2.2rem)] font-bold">Welcome Back</h2>
          <p className="mt-2 text-[#9a9a9a]">Access your restaurant&apos;s performance dashboard.</p>

          <div className="mt-6 flex gap-8 border-b border-[#2a2a2a]" role="tablist" aria-label="Authentication tabs">
            <Link
              href="/restaurant/login"
              className="border-b-[3px] border-fly-orange pb-3 font-bold text-fly-orange no-underline"
              aria-current="page"
            >
              Sign In
            </Link>
            <Link href="/restaurant/signup" className="pb-3 font-bold text-[#838383] no-underline">
              Sign Up
            </Link>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-[10px] bg-red-500/10 p-3 text-[0.8rem] text-red-500 font-medium border border-red-500/20">
                {error}
              </div>
            )}

            <label className="grid gap-2 text-[0.7rem] font-extrabold tracking-[0.08em] text-[#b0b0b0]">
              BUSINESS EMAIL
              <span className="flex min-h-[52px] items-center gap-3 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] px-4 text-[#757575] focus-within:border-fly-orange focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]">
                <Mail className="h-4 w-4" />
                <input
                  type="email"
                  placeholder="executive@restaurant.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 bg-transparent text-white outline-0 placeholder:text-[#7b7b7b]"
                />
              </span>
            </label>

            <label className="grid gap-2 text-[0.7rem] font-extrabold tracking-[0.08em] text-[#b0b0b0]">
              <span className="flex items-center justify-between gap-4">
                <span>PASSWORD</span>
                <Link href="/password-reset" className="text-[0.78rem] font-bold text-fly-orange no-underline">
                  Forgot Password?
                </Link>
              </span>
              <span className="flex min-h-[52px] items-center gap-3 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] px-4 text-[#757575] focus-within:border-fly-orange focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]">
                <Lock className="h-4 w-4" />
                <input
                  type="password"
                  placeholder="********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 bg-transparent text-white outline-0 placeholder:text-[#7b7b7b]"
                />
              </span>
            </label>

            <label className="inline-flex items-center gap-2 text-[0.82rem] font-semibold text-[#a3a3a3]">
              <input type="checkbox" className="h-4 w-4 accent-fly-orange" /> Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-fly-orange font-black text-white disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to Executive Panel"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-[0.66rem] font-extrabold tracking-[0.12em] text-[#777777]">
            <span className="h-px flex-1 bg-[#2f2f2f]" />
            OR CONTINUE WITH
            <span className="h-px flex-1 bg-[#2f2f2f]" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" className="min-h-12 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] text-[#ededed]">
              <span className="font-black text-[#4285f4]">G</span> Google
            </button>
            <button type="button" className="min-h-12 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] text-[#ededed]">
              <Apple className="inline h-4 w-4" /> Apple
            </button>
          </div>

          <footer className="mt-5 grid gap-2 text-center text-[0.72rem] text-[#7a7a7a]">
            <small>(c) 2024 FlyMenu Platform. All rights reserved.</small>
            <span>Privacy Policy - Terms of Service</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
