"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFloatingField } from "@/components/auth/AuthFloatingField";
import { AuthShell } from "@/components/auth/AuthShell";

const API = "http://localhost:4000/api/v1";

/* ─── Step 1: Request Reset ───────────────────────────────────────────────── */
function RequestStep({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;

    try {
      const res = await fetch(`${API}/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to request reset.");
      onSuccess(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard backHref="/login" centered>
      <div className="mx-auto w-full max-w-[508px]">
        <h2 className="m-0 text-[1.85rem] font-black tracking-[-0.02em] text-white">
          Reset Password
        </h2>
        <p className="mx-auto mt-2 max-w-[420px] text-[0.92rem] font-medium text-[#a3a3a3]">
          Please enter your email address to request a password reset
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5 text-left">
          <AuthFloatingField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-fly-orange py-3 text-[0.88rem] font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_40px_rgba(249,115,22,0.25)] transition hover:-translate-y-[1px] hover:bg-[#ea6c10] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Sending..." : "Send Reset Token"}
          </button>
        </form>
      </div>
    </AuthCard>
  );
}

/* ─── Step 2: Confirm Reset ───────────────────────────────────────────────── */
function ConfirmStep({ email }: { email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const fd = new FormData(e.currentTarget);
    const token = fd.get("token") as string;
    const newPassword = fd.get("newPassword") as string;
    const confirmPassword = fd.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to reset password.");
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard centered>
        <div className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-black text-white">Password Reset!</h2>
          <p className="mt-2 text-[#a3a3a3]">Your password has been successfully updated.</p>
          <p className="mt-6 text-sm text-[#666666]">Redirecting to login...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard backHref="/password-reset" centered>
      <div className="mx-auto w-full max-w-[508px]">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-fly-orange/10 text-fly-orange">
          <MailCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-[1.85rem] font-black tracking-[-0.02em] text-white">
          Check your email
        </h2>
        <p className="mx-auto mt-2 max-w-[420px] text-[0.92rem] font-medium text-[#a3a3a3]">
          We sent a reset token to <span className="font-bold text-white">{email}</span>.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 text-left">
          <label className="grid gap-2 text-[0.7rem] font-extrabold tracking-[0.08em] text-[#b0b0b0]">
            RESET CODE
            <input
              name="token"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-[60px] w-full rounded-[10px] border border-[#2f2f2f] bg-black px-6 text-center text-2xl font-black tracking-[0.4em] text-white focus:border-fly-orange focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] outline-none placeholder:text-[#444] transition"
              required
            />
          </label>
          <AuthFloatingField
            label="New Password"
            name="newPassword"
            autoComplete="new-password"
            passwordToggle
            required
          />
          <AuthFloatingField
            label="Confirm New Password"
            name="confirmPassword"
            autoComplete="new-password"
            passwordToggle
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-fly-orange py-3 text-[0.88rem] font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_40px_rgba(249,115,22,0.25)] transition hover:-translate-y-[1px] hover:bg-[#ea6c10] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthCard>
  );
}

/* ─── Page orchestrator ───────────────────────────────────────────────────── */
export default function PasswordResetPage() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");

  const handleRequestSuccess = (requestedEmail: string) => {
    setEmail(requestedEmail);
    setStep("confirm");
  };

  return (
    <AuthShell>
      {step === "request" ? (
        <RequestStep onSuccess={handleRequestSuccess} />
      ) : (
        <ConfirmStep email={email} />
      )}
    </AuthShell>
  );
}
