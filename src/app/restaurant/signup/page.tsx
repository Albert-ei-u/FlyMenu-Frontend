"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Apple, ArrowRight, LineChart, Lock, Mail, UserRound, UtensilsCrossed, Zap, CheckCircle, Loader2, MailCheck } from "lucide-react";

const API = "http://localhost:4000/api/v1";

/* ─── Step 1: Registration Form ───────────────────────────────────────────── */
function RegisterStep({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const fullName = fd.get("fullName") as string;
    const email = fd.get("email") as string;
    const restaurantName = fd.get("restaurantName") as string;
    const password = fd.get("password") as string;

    try {
      const res = await fetch(`${API}/auth/restaurant/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, restaurantName, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to create account.");
      onSuccess(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[560px]">
      <h2 className="m-0 text-[clamp(1.65rem,2.6vw,2.2rem)] font-bold">Create Executive Account</h2>
      <p className="mt-2 text-[#9a9a9a]">Join the next generation of restaurant operators.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {[
          { label: "FULL NAME", name: "fullName", icon: <UserRound className="h-4 w-4" />, type: "text" as const, placeholder: "John Doe" },
          { label: "BUSINESS EMAIL", name: "email", icon: <Mail className="h-4 w-4" />, type: "email" as const, placeholder: "john@restaurant.com" },
          { label: "RESTAURANT NAME", name: "restaurantName", icon: <UtensilsCrossed className="h-4 w-4" />, type: "text" as const, placeholder: "FlyMenu Bistro" },
          { label: "PASSWORD", name: "password", icon: <Lock className="h-4 w-4" />, type: "password" as const, placeholder: "********" },
        ].map((field) => (
          <label key={field.label} className="grid gap-2 text-[0.7rem] font-extrabold tracking-[0.08em] text-[#b0b0b0]">
            {field.label}
            <span className="flex min-h-[52px] items-center gap-3 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] px-4 text-[#757575] focus-within:border-fly-orange focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]">
              {field.icon}
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required
                className="w-full border-0 bg-transparent text-white outline-0 placeholder:text-[#7b7b7b]"
              />
            </span>
          </label>
        ))}

        <button type="submit" disabled={loading} className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-fly-orange font-black text-white disabled:opacity-60 transition hover:bg-[#ea6c10]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Creating..." : "Create Account"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-[0.66rem] font-extrabold tracking-[0.12em] text-[#777777]">
        <span className="h-px flex-1 bg-[#2f2f2f]" />
        OR CONTINUE WITH
        <span className="h-px flex-1 bg-[#2f2f2f]" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="min-h-12 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] text-[#ededed] transition hover:bg-[#222]">
          <span className="font-black text-[#4285f4]">G</span> Google
        </button>
        <button type="button" className="min-h-12 rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] text-[#ededed] transition hover:bg-[#222]">
          <Apple className="inline h-4 w-4" /> Apple
        </button>
      </div>

      <p className="mt-4 text-center text-[#9a9a9a]">
        Already have an account?{" "}
        <Link href="/restaurant/login" className="font-extrabold text-fly-orange no-underline hover:text-fly-peach">
          Login here
        </Link>
      </p>

      <small className="mt-4 block text-center text-[0.62rem] leading-[1.6] tracking-[0.06em] text-[#6f6f6f]">
        BY CREATING AN ACCOUNT, YOU AGREE TO OUR TERMS OF SERVICE AND PRIVACY POLICY. EXECUTIVE PANEL ACCESS IS SUBJECT TO VERIFICATION.
      </small>
    </div>
  );
}

/* ─── Step 2: OTP Verification ────────────────────────────────────────────── */
function VerifyStep({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Verification failed.");
      
      // Store token and redirect to admin dashboard
      localStorage.setItem("accessToken", data.accessToken);
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${60 * 60 * 24}`;
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    try {
      await fetch(`${API}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[500px]">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-fly-orange/10 text-fly-orange">
          <MailCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-[clamp(1.65rem,2.6vw,2.2rem)] font-bold text-white">
          Verify your email
        </h2>
        <p className="mt-2 text-[#9a9a9a]">
          We sent a 6-digit verification code to <span className="font-bold text-white">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-400">
          {error}
        </div>
      )}
      {resent && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-400">
          <CheckCircle className="h-4 w-4" /> New code sent!
        </div>
      )}

      <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-5">
        <label className="grid gap-2 text-[0.7rem] font-extrabold tracking-[0.08em] text-[#b0b0b0]">
          VERIFICATION CODE
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="h-[60px] w-full rounded-[10px] border border-[#2f2f2f] bg-[#1a1a1a] px-6 text-center text-2xl font-black tracking-[0.4em] text-white focus:border-fly-orange focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] outline-none placeholder:text-[#444] transition"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-fly-orange font-black text-white disabled:opacity-60 transition hover:bg-[#ea6c10]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Verifying..." : "Verify & Enter Dashboard"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-medium text-[#9a9a9a]">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="font-extrabold text-fly-orange transition hover:text-fly-peach disabled:opacity-60"
        >
          {resending ? "Sending..." : "Resend"}
        </button>
      </p>
    </div>
  );
}

/* ─── Page Orchestrator ───────────────────────────────────────────────────── */
export default function RestaurantSignupPage() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-dvh bg-[#0f0f0f] text-white lg:grid lg:grid-cols-[0.47fr_0.53fr]">
      <section className="grid content-start gap-5 bg-[radial-gradient(circle_at_70%_0,rgba(249,115,22,0.16),transparent_40%),linear-gradient(160deg,#1b130f,#0f0f0f_58%)] p-6 lg:p-10 relative">
        <header className="flex items-center gap-3">
          <Image src="/flymenu-logo.png" alt="FlyMenu logo" width={44} height={44} priority />
          <div>
            <strong className="block text-[1.15rem] leading-none">FlyMenu</strong>
            <small className="block text-[0.62rem] tracking-[0.14em] text-[#8f8f8f]">EXECUTIVE PANEL</small>
          </div>
        </header>

        <h1 className="mt-2 max-w-[640px] text-[clamp(1.8rem,3.3vw,2.8rem)] font-bold leading-[1.12]">
          The Modern Standard for <span className="text-fly-orange">Restaurant Intelligence.</span>
        </h1>
        <p className="m-0 max-w-[640px] text-[#b2b2b2] leading-[1.6]">
          Empower your culinary vision with real-time analytics, automated workflows, and the industry&apos;s most intuitive executive dashboard.
        </p>

        <div className="grid gap-3">
          <article className="grid grid-cols-[34px_1fr] items-start gap-3">
            <i className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-fly-orange text-white">
              <LineChart className="h-4 w-4" />
            </i>
            <div>
              <strong className="block">Advanced Analytics</strong>
              <small className="mt-1 block text-[#a3a3a3] leading-[1.55]">
                Deep dive into your restaurant&apos;s performance metrics.
              </small>
            </div>
          </article>
          <article className="grid grid-cols-[34px_1fr] items-start gap-3">
            <i className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-fly-orange text-white">
              <Zap className="h-4 w-4" />
            </i>
            <div>
              <strong className="block">Automated Workflows</strong>
              <small className="mt-1 block text-[#a3a3a3] leading-[1.55]">
                Reduce manual tasks by up to 40% with smart automation.
              </small>
            </div>
          </article>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[#2f2f2f] shadow-[0_24px_56px_rgba(0,0,0,0.36)]">
          <Image
            src="/container.png"
            alt="Restaurant analytics dashboard preview"
            width={950}
            height={620}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="h-auto w-full"
          />
        </div>

        <small className="text-[0.66rem] tracking-[0.12em] text-[#9a9a9a]">
          TRUSTED BY OVER 5,000+ ESTABLISHMENTS WORLDWIDE
        </small>
      </section>

      <section className="grid place-items-center bg-[#101010] p-6 lg:p-10 relative">
        {step === "register" ? (
          <RegisterStep onSuccess={(em) => { setEmail(em); setStep("verify"); }} />
        ) : (
          <VerifyStep email={email} />
        )}
      </section>
    </main>
  );
}
