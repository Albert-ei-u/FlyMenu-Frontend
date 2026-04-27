"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";

import { api } from "@/lib/api";

export default function LoginPage() {
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

      // Store token and user
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.accessToken}; path=/; max-age=86400`;

      // Redirect based on role
      switch (data.user.role) {
        case "SUPER_ADMIN":
          router.push("/platform/dashboard");
          break;
        case "RESTAURANT_OWNER":
          router.push("/admin/dashboard");
          break;
        default:
          router.push("/explore");
          break;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard backHref="/">
        <h2 className="m-0 text-[1.85rem] font-black tracking-[-0.02em] text-white">
          Log in
        </h2>
        <p className="mt-2 text-[0.92rem] font-medium text-[#a3a3a3]">
          Welcome back Dear !
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="h-[52px] w-full rounded-full border border-[#444444] bg-transparent px-6 text-[0.92rem] text-white outline-none transition placeholder:text-[#666666] focus:border-fly-orange focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="h-[52px] w-full rounded-full border border-[#444444] bg-transparent px-6 text-[0.92rem] text-white outline-none transition placeholder:text-[#666666] focus:border-fly-orange focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="-mt-1 text-right">
            <Link
              href="/password-reset"
              className="text-[0.82rem] font-semibold text-[#a3a3a3] no-underline transition hover:text-fly-orange"
            >
              Forgot password ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mx-auto mt-2 flex w-[65%] items-center justify-center rounded-full bg-fly-orange py-3 text-[0.88rem] font-black uppercase tracking-[0.06em] text-white shadow-[0_14px_40px_rgba(249,115,22,0.25)] transition hover:-translate-y-[1px] hover:bg-[#ea6c10] hover:shadow-[0_18px_50px_rgba(249,115,22,0.32)] active:translate-y-0 disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-7 text-center text-[0.88rem] font-medium text-[#a3a3a3]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-extrabold text-fly-orange no-underline transition hover:text-fly-peach"
          >
            Sign up
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
