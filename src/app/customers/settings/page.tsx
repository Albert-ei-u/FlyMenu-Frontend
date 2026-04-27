"use client";

import { useState, useRef } from "react";
import { Camera, Mail, Phone, Lock, Save, User } from "lucide-react";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Reveal } from "@/components/motion";

export default function CustomerSettingsPage() {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <CustomerShell activeNav="Explore">
      <div className="mx-auto max-w-[760px] px-5 py-12 lg:px-8">
        <Reveal blur>
          <div className="mb-8">
            <h1 className="m-0 text-2xl font-black text-white">Profile Settings</h1>
            <p className="mt-1 text-[#888888]">Manage your personal information and preferences</p>
          </div>
        </Reveal>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <Reveal delay={60}>
            <section className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6">
              <h2 className="m-0 mb-5 text-base font-bold text-white">Profile Photo</h2>
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-fly-orange/40"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#333333] bg-[#1a1a1a] text-[#555555]">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111111] bg-fly-orange text-white shadow-lg transition hover:bg-[#ea6c10]"
                    aria-label="Change profile photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {avatarSrc ? "Looking good!" : "No profile photo yet"}
                  </p>
                  <p className="mt-1 text-xs text-[#666666]">
                    Click the camera icon to upload a photo. JPG, PNG or WebP up to 5MB.
                  </p>
                  {avatarSrc && (
                    <button
                      type="button"
                      onClick={() => setAvatarSrc(null)}
                      className="mt-2 text-xs font-semibold text-red-400 transition hover:text-red-300"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </section>
          </Reveal>

          {/* Personal Info */}
          <Reveal delay={120}>
            <section className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6">
              <h2 className="m-0 mb-5 text-base font-bold text-white">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">Full Name</span>
                  <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 focus-within:border-fly-orange/60">
                    <User className="h-4 w-4 shrink-0 text-[#555555]" />
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#444]"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">Email Address</span>
                  <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 focus-within:border-fly-orange/60">
                    <Mail className="h-4 w-4 shrink-0 text-[#555555]" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#444]"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">Phone Number</span>
                  <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 focus-within:border-fly-orange/60">
                    <Phone className="h-4 w-4 shrink-0 text-[#555555]" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#444]"
                    />
                  </div>
                </label>
              </div>
            </section>
          </Reveal>

          {/* Password */}
          <Reveal delay={180}>
            <section className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6">
              <h2 className="m-0 mb-5 text-base font-bold text-white">Change Password</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
                  <label
                    key={label}
                    className={`flex flex-col gap-1.5 ${i === 2 ? "sm:col-span-2" : ""}`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">{label}</span>
                    <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 focus-within:border-fly-orange/60">
                      <Lock className="h-4 w-4 shrink-0 text-[#555555]" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#444]"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Save Button */}
          <Reveal delay={220}>
            <div className="flex items-center justify-between">
              {saved && (
                <span className="flex items-center gap-2 text-sm font-semibold text-green-400">
                  ✓ Changes saved successfully
                </span>
              )}
              <button
                type="submit"
                className="ml-auto flex items-center gap-2 rounded-xl bg-fly-orange px-8 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition hover:-translate-y-[1px] hover:bg-[#ea6c10] active:translate-y-0"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </Reveal>
        </form>
      </div>
    </CustomerShell>
  );
}
