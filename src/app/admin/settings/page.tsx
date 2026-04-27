"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bell,
  Mail,
  MapPinned,
  Phone,
  Shield,
  SlidersHorizontal,
  Info,
  Clock,
  Armchair,
  Utensils,
  Image as ImageIcon,
  Share2,
  Camera,
  Plus,
} from "lucide-react";
import { Reveal } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  adminPageTitleH1,
  adminPageTitleP,
  mobileFilter,
} from "@/components/admin/admin-ui";

interface RestaurantProfile {
  id: string;
  name: string;
  businessType: string;
  cuisine: string;
  description: string;
  shortDescription: string;
  priceRange: string;
  websiteUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  addressLine: string;
  city: string;
  country: string;
  openingTime: string;
  closingTime: string;
  daysOpen: string[];
  services: string[];
  totalTables: number;
  averageSeats: number;
  maxPartySize: number;
  privateDining: boolean;
  outdoorSeating: boolean;
  reservationRequired: boolean;
}

const CardHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <h2 className="mb-5 m-0 flex items-center gap-3 text-base font-bold text-white">
    <div className="grid h-7 w-7 place-items-center rounded-full bg-fly-orange/10 text-fly-orange">
      <Icon className="h-4 w-4" />
    </div>
    {title}
  </h2>
);

const Label = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    className={`block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] ${className}`}
  >
    {children}
  </label>
);

const Input = ({ className = "", icon: Icon, ...props }: any) => {
  if (Icon) {
    return (
      <div className={`relative mt-1.5 ${className}`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]">
          <Icon className="h-4 w-4" />
        </div>
        <input
          className="w-full rounded-lg border border-[#333333] bg-[#141414] py-2.5 pl-10 pr-3 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange transition-colors"
          {...props}
        />
      </div>
    );
  }
  return (
    <input
      className={`mt-1.5 w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2.5 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange transition-colors ${className}`}
      {...props}
    />
  );
};

const Toggle = ({ checked }: { checked?: boolean }) => (
  <div
    className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${checked ? "bg-fly-orange" : "bg-[#333]"}`}
  >
    <span
      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </div>
);

export default function AdminSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const resetData = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/restaurant/login");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/restaurants/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch restaurant profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as any;
    setProfile((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleToggle = (name: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const token = localStorage.getItem("accessToken");

    try {
      const {
        owner,
        media,
        categories,
        tables,
        settings,
        application,
        ...updateData
      } = profile;
      const res = await fetch(
        "http://localhost:4000/api/v1/restaurants/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await fetchProfile();
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestApproval = async () => {
    setRequestingApproval(true);
    setMessage(null);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/restaurants/request-approval",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Approval request sent to Super Admin!",
        });
        await fetchProfile();
      } else {
        const error = await res.json();
        setMessage({
          type: "error",
          text: error.message || "Failed to request approval.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while requesting approval.",
      });
    } finally {
      setRequestingApproval(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover" | "gallery",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type.toUpperCase());
    formData.append("restaurantId", profile.id);

    try {
      const res = await fetch("http://localhost:4000/api/v1/media/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setMessage({ type: "success", text: `${type} image uploaded!` });
        await fetchProfile();
      } else {
        setMessage({ type: "error", text: "Upload failed." });
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  if (loading) {
    return (
      <AdminShell active="Settings">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  const r = profile || {};
  const isPending =
    r.application?.status === "NEW" ||
    r.application?.status === "MORE_INFO_REQUESTED";
  const isActive = r.status === "ACTIVE";

  const serviceTags = [
    "Dine In",
    "Takeaway",
    "Private Events",
    "Delivery",
    "Catering",
    "Room Service",
    "Outdoor Seating",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Late Night",
    "Brunch",
  ].map((label) => ({ label, active: r.services?.includes(label) }));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (label) => ({
      label,
      active: r.daysOpen?.includes(label),
    }),
  );

  return (
    <AdminShell active="Settings">
      <div className={adminContent}>
        <Reveal blur>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className={adminPageTitleH1}>Executive Settings</h1>
              <p className={adminPageTitleP}>
                Configure your brand identity and operational parameters.
              </p>
            </div>
            <div className="flex gap-3">
              {message && (
                <div
                  className={`flex items-center rounded-lg px-4 py-2 text-xs font-bold ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {message.text}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#333] bg-[#1a1a1a] px-6 text-sm font-bold text-white transition-all hover:bg-[#222] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {!isActive && (
                <button
                  onClick={handleRequestApproval}
                  disabled={requestingApproval || isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-fly-orange px-6 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-[0_8px_20px_rgba(249,115,22,0.2)]"
                >
                  {requestingApproval
                    ? "Sending..."
                    : isPending
                      ? "Approval Pending"
                      : "Request Approval"}
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            <Reveal delay={80}>
              <article className={`${adminCard} p-6`}>
                <CardHeader icon={Info} title="Basic Information" />
                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    Restaurant Name
                    <Input
                      name="name"
                      value={r.name || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                  <Label>
                    Business Type
                    <Input
                      name="businessType"
                      value={r.businessType || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
                <Label className="mt-4">
                  Cuisine Specialty
                  <Input
                    name="cuisine"
                    value={r.cuisine || ""}
                    onChange={handleInputChange}
                  />
                </Label>
                <Label className="mt-4">
                  Short Description
                  <textarea
                    name="shortDescription"
                    className="mt-1.5 w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2.5 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange transition-colors min-h-[88px] resize-y"
                    value={r.shortDescription || ""}
                    onChange={handleInputChange}
                  />
                </Label>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Label>
                    Price Range
                    <select
                      name="priceRange"
                      className="mt-1.5 w-full appearance-none rounded-lg border border-[#333333] bg-[#141414] px-3 py-2.5 text-sm text-white outline-0 focus:border-fly-orange transition-colors"
                      value={r.priceRange || ""}
                      onChange={handleInputChange}
                    >
                      <option value="Moderate">Moderate</option>
                      <option value="Expensive">Expensive</option>
                      <option value="Very Expensive">Very Expensive</option>
                    </select>
                  </Label>
                  <Label>
                    Website URL
                    <Input
                      name="websiteUrl"
                      value={r.websiteUrl || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
              </article>
            </Reveal>

            <Reveal delay={120}>
              <article className={`${adminCard} p-6`}>
                <CardHeader icon={Clock} title="Operating Hours" />
                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    Opening Time
                    <Input
                      name="openingTime"
                      value={r.openingTime || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                  <Label>
                    Closing Time
                    <Input
                      name="closingTime"
                      value={r.closingTime || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
                <div className="mt-5">
                  <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] mb-2">
                    Days Open
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {days.map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => {
                          const newDays = r.daysOpen?.includes(d.label)
                            ? r.daysOpen.filter(
                                (day: string) => day !== d.label,
                              )
                            : [...(r.daysOpen || []), d.label];
                          setProfile((prev: any) => ({
                            ...prev,
                            daysOpen: newDays,
                          }));
                        }}
                        className={`grid h-[38px] w-[38px] place-items-center rounded-full text-[0.75rem] font-bold transition-colors ${
                          d.active
                            ? "bg-fly-orange text-white"
                            : "border border-[#333333] bg-[#1a1a1a] text-[#888888]"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            <Reveal delay={100}>
              <article className={`${adminCard} p-6`}>
                <CardHeader icon={MapPinned} title="Contact & Location" />
                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    Email
                    <Input
                      name="email"
                      value={r.email || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                  <Label>
                    Phone
                    <Input
                      name="phone"
                      value={r.phone || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
                <Label className="mt-4">
                  WhatsApp (Optional)
                  <Input
                    name="whatsapp"
                    placeholder="Include country code"
                    value={r.whatsapp || ""}
                    onChange={handleInputChange}
                  />
                </Label>
                <Label className="mt-4">
                  Full Address
                  <Input
                    name="addressLine"
                    value={r.addressLine || ""}
                    onChange={handleInputChange}
                  />
                </Label>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Label>
                    City
                    <Input
                      name="city"
                      value={r.city || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                  <Label>
                    Country
                    <Input
                      name="country"
                      value={r.country || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
              </article>
            </Reveal>

            <Reveal delay={140}>
              <article className={`${adminCard} p-6`}>
                <CardHeader icon={Armchair} title="Tables & Capacity" />
                <div className="grid grid-cols-3 gap-4 pb-5 border-b border-[#262626]">
                  <Label>
                    Total Tables
                    <Input
                      name="totalTables"
                      type="number"
                      value={r.totalTables || 0}
                      onChange={handleInputChange}
                      className="text-center"
                    />
                  </Label>
                  <Label>
                    Avg Seats
                    <Input
                      name="averageSeats"
                      type="number"
                      value={r.averageSeats || 0}
                      onChange={handleInputChange}
                      className="text-center"
                    />
                  </Label>
                  <Label>
                    Max Party
                    <Input
                      name="maxPartySize"
                      type="number"
                      value={r.maxPartySize || 0}
                      onChange={handleInputChange}
                      className="text-center"
                    />
                  </Label>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                    <span className="text-sm font-semibold text-white">
                      Private Dining Room
                    </span>
                    <div onClick={() => handleToggle("privateDining")}>
                      <Toggle checked={r.privateDining} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                    <span className="text-sm font-semibold text-white">
                      Outdoor Seating
                    </span>
                    <div onClick={() => handleToggle("outdoorSeating")}>
                      <Toggle checked={r.outdoorSeating} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-semibold text-white">
                      Reservation Required
                    </span>
                    <div onClick={() => handleToggle("reservationRequired")}>
                      <Toggle checked={r.reservationRequired} />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </div>

        {/* FULL WIDTH ROWS */}
        <div className="mt-6 flex flex-col gap-6">
          <Reveal delay={160}>
            <section className={`${adminCard} p-6`}>
              <CardHeader icon={Utensils} title="Services Offered" />
              <div className="flex flex-wrap gap-2.5">
                {serviceTags.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    className={`rounded-lg border px-4 py-2 text-[0.8rem] font-bold transition-all duration-300 ${
                      tag.active
                        ? "border-fly-orange bg-fly-orange text-white"
                        : "border-[#333333] text-[#888888] bg-[#1a1a1a] hover:border-[#555]"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={180}>
            <section className={`${adminCard} p-6`}>
              <CardHeader icon={ImageIcon} title="Media & Branding" />
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.8fr] gap-6">
                <div>
                  <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] mb-3">
                    Cover Photo
                  </span>
                  <div className="relative group h-40 overflow-hidden rounded-2xl border border-[#262626] bg-[#111]">
                    <Image
                      src={
                        r.media?.find((m: any) => m.type === "COVER")?.url ||
                        "/banner-img-260x260.jpg.png"
                      }
                      alt="Cover"
                      fill
                      className="object-cover opacity-60 transition-transform group-hover:scale-105"
                    />
                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <span className="text-[0.65rem] font-bold text-white uppercase tracking-wider">
                        Change Cover
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "cover")}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] mb-3">
                    Brand Identity
                  </span>
                  <label className="group relative flex h-40 items-center justify-center rounded-2xl bg-[#1a1a1a] border border-[#262626] cursor-pointer overflow-hidden">
                    <div className="relative h-24 w-24">
                      <Image
                        src={
                          r.media?.find((m: any) => m.type === "PROFILE")
                            ?.url || "/flymenu-logo.png"
                        }
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Plus className="h-6 w-6 text-white" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "profile")}
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] mb-3">
                    Gallery (6 Slots)
                  </span>
                  <div className="grid grid-cols-3 gap-3 h-40">
                    {r.media
                      ?.filter((m: any) => m.type === "GALLERY")
                      .slice(0, 6)
                      .map((m: any, i: number) => (
                        <div
                          key={m.id}
                          className="relative group rounded-xl border border-[#262626] bg-[#111] overflow-hidden"
                        >
                          <Image
                            src={m.url}
                            alt="Gallery"
                            fill
                            className="object-cover opacity-80 group-hover:scale-110 transition-transform"
                          />
                        </div>
                      ))}
                    {Array.from({
                      length: Math.max(
                        0,
                        6 -
                          (r.media?.filter((m: any) => m.type === "GALLERY")
                            .length || 0),
                      ),
                    }).map((_, i) => (
                      <label
                        key={`empty-${i}`}
                        className="grid place-items-center rounded-xl border border-dashed border-[#333] bg-[#111] cursor-pointer hover:bg-[#151515] transition-colors"
                      >
                        <Plus className="h-4 w-4 text-[#444]" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "gallery")}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        </div>

        {/* BOTTOM HALF GRID */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Reveal delay={200}>
            <article className={`${adminCard} p-6`}>
              <CardHeader icon={Share2} title="Social Media" />
              <div className="flex flex-col gap-4">
                <Input
                  icon={MapPinned}
                  defaultValue="@obsidiangrill_official"
                />
                <Input icon={Share2} defaultValue="fb.com/obsidiangrill" />
                <Input icon={Utensils} placeholder="TripAdvisor URL" />
                <Input icon={MapPinned} placeholder="Google Business Profile" />
              </div>
            </article>
          </Reveal>

          <Reveal delay={220}>
            <article className={`${adminCard} p-6`}>
              <CardHeader icon={Bell} title="Notifications" />
              <div className="flex flex-col">
                <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#888]" />
                    <span className="text-sm font-semibold text-white">
                      Email Notifications
                    </span>
                  </div>
                  <Toggle checked />
                </div>
                <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                  <div className="flex items-center gap-3">
                    <MapPinned className="h-5 w-5 text-[#888]" />
                    <span className="text-sm font-semibold text-white">
                      SMS Alerts
                    </span>
                  </div>
                  <Toggle />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#888]" />
                    <span className="text-sm font-semibold text-white">
                      Order Updates
                    </span>
                  </div>
                  <Toggle checked />
                </div>
              </div>
            </article>
          </Reveal>
        </div>

        {/* SECURITY FULL WIDTH */}
        <Reveal delay={240} className="mt-6">
          <section className={`${adminCard} p-6`}>
            <CardHeader icon={Shield} title="Security" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-[#262626] bg-[#141414] p-5">
              <div className="flex-1">
                <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] mb-2">
                  Account Password
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-[#333333] bg-[#1a1a1a] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#222]"
                >
                  Change Password
                </button>
              </div>

              <div className="flex-1 border-l border-[#262626] pl-6 max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-4">
                <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888] mb-2">
                  Two-Factor Auth
                </span>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sm font-bold text-[#22c55e]">
                    Active
                  </span>
                  <Toggle checked />
                </div>
              </div>

              <div className="flex-1 border-l border-[#262626] pl-6 max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#888]" />
                  <div>
                    <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-[#888888]">
                      Last Login
                    </span>
                    <p className="m-0 mt-1 text-sm text-white">
                      Today at 09:42 AM from Springfield,IL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* FOOTER ACTIONS */}
        <Reveal delay={260}>
          <div className="mt-8 flex items-center justify-end gap-4 mb-8">
            <button
              type="button"
              onClick={resetData}
              className="rounded-xl border border-[#333333] bg-transparent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#222]"
            >
              Discard
            </button>
            {!isActive && (
              <button
                type="button"
                onClick={handleRequestApproval}
                disabled={requestingApproval || isPending}
                className="flex items-center gap-2 rounded-xl bg-fly-orange px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 shadow-[0_8px_24px_rgba(249,115,22,0.2)] disabled:opacity-50"
              >
                <Shield className="h-4 w-4" />
                {requestingApproval
                  ? "Sending..."
                  : isPending
                    ? "Approval Pending"
                    : "Request Approval"}
              </button>
            )}
          </div>
        </Reveal>
      </div>

      <button
        type="button"
        className={mobileFilter}
        aria-label="Settings controls"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </AdminShell>
  );
}
