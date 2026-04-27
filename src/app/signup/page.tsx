"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFloatingField } from "@/components/auth/AuthFloatingField";
import { AuthShell } from "@/components/auth/AuthShell";

const API = "http://localhost:4000/api/v1";

/* ─── Step 1: Registration form ───────────────────────────────────────────── */
function RegisterStep({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(formRef.current!);
    const fullName = fd.get("name") as string;
    const email = fd.get("email") as string;
    const phone = fd.get("phone") as string;
    const password = fd.get("password") as string;
    const confirm = fd.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Signup failed. Please try again.");
      onSuccess(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard backHref="/">
      <h2 className="m-0 text-[1.85rem] font-black tracking-[-0.02em] text-white">
        Create Account
      </h2>
      <p className="mt-2 text-[0.92rem] font-medium text-[#a3a3a3]">
        Join FlyMenu and start exploring today
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <AuthFloatingField label="Full Name" name="name" autoComplete="name" required />
        <AuthFloatingField label="Email" type="email" name="email" autoComplete="email" required />
        <AuthFloatingField label="Phone (optional)" type="tel" name="phone" autoComplete="tel" />
        <AuthFloatingField label="Password" name="password" autoComplete="new-password" passwordToggle required />
        <AuthFloatingField label="Confirm Password" name="confirmPassword" autoComplete="new-password" passwordToggle required />

        <button
          type="submit"
          disabled={loading}
          className="mx-auto mt-1 flex w-[65%] items-center justify-center gap-2 rounded-full bg-fly-orange py-3 text-[0.88rem] font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_40px_rgba(249,115,22,0.25)] transition hover:-translate-y-[1px] hover:bg-[#ea6c10] hover:shadow-[0_18px_50px_rgba(249,115,22,0.32)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Creating..." : "SIGN UP"}
        </button>
      </form>

      <p className="mt-7 text-center text-[0.88rem] font-medium text-[#a3a3a3]">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-fly-orange no-underline transition hover:text-fly-peach">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

/* ─── Step 2: OTP verification ────────────────────────────────────────────── */
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
      // Store token and redirect to explore
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${60 * 60 * 24}`;
      router.push("/explore");
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
    <AuthCard backHref="/signup">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-fly-orange/10 text-fly-orange">
          <MailCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-[1.85rem] font-black tracking-[-0.02em] text-white">
          Check your email
        </h2>
        <p className="mt-2 text-[0.92rem] font-medium text-[#a3a3a3]">
          We sent a 6-digit code to{" "}
          <span className="font-bold text-white">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-400">
          {error}
        </div>
      )}
      {resent && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-400">
          <CheckCircle className="h-4 w-4" /> New code sent!
        </div>
      )}

      <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-5">
        <div className="relative">
          <label className="pointer-events-none absolute left-6 top-[-0.58rem] z-[1] bg-[#1a1a1a] px-2 text-[0.72rem] font-semibold text-fly-orange">
            Verification Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="h-[52px] w-full rounded-full border border-fly-orange bg-transparent px-6 text-center text-xl font-black tracking-[0.4em] text-white shadow-[0_0_0_3px_rgba(249,115,22,0.12)] outline-none placeholder:text-[#444]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="mx-auto flex w-[65%] items-center justify-center gap-2 rounded-full bg-fly-orange py-3 text-[0.88rem] font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_40px_rgba(249,115,22,0.25)] transition hover:-translate-y-[1px] hover:bg-[#ea6c10] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Verifying..." : "VERIFY EMAIL"}
        </button>
      </form>

      <p className="mt-6 text-center text-[0.88rem] font-medium text-[#a3a3a3]">
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
    </AuthCard>
  );
}

/* ─── Page orchestrator ───────────────────────────────────────────────────── */
export default function SignupPage() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");

  const handleRegistered = (registeredEmail: string) => {
    setEmail(registeredEmail);
    setStep("verify");
  };

  return (
    <AuthShell>
      {step === "register" ? (
        <RegisterStep onSuccess={handleRegistered} />
      ) : (
        <VerifyStep email={email} />
      )}
    </AuthShell>
  );
}
