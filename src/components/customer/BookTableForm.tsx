"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Info,
  Phone,
  Star,
  Table2,
  Users,
} from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#333333] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white outline-0 focus:border-fly-orange";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  media: { url: string }[];
  address: string;
  cuisine: string;
  ratingAverage: number;
  ratingCount: number;
}

interface BookTableFormProps {
  restaurant: Restaurant;
}

const bookTableDefaults = {
  steps: ["Date & Time", "Party Size", "Table Selection", "Confirmation"],
  timeSlots: ["12:00", "13:30", "18:00", "19:30", "20:45", "22:00"],
  partySizes: [1, 2, 3, 4, 5, 6, 7, 8],
  tables: [],
};

import { api } from "@/lib/api";

export function BookTableForm({ restaurant }: BookTableFormProps) {
  const router = useRouter();
  const { steps, timeSlots, partySizes } = bookTableDefaults;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [partySize, setPartySize] = useState(4);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [backendSlots, setBackendSlots] = useState<any[]>([]);

  // Calendar logic
  const [viewDate, setViewDate] = useState(new Date());
  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const yearNum = viewDate.getFullYear();

  const days = Array.from(
    { length: daysInMonth(yearNum, viewDate.getMonth()) },
    (_, i) => i + 1,
  );
  const padding = Array.from(
    { length: firstDayOfMonth(yearNum, viewDate.getMonth()) },
    (_, i) => i,
  );

  const isToday = (d: number) => {
    const today = new Date();
    return (
      d === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (d: number) => {
    return (
      d === selectedDate.getDate() &&
      viewDate.getMonth() === selectedDate.getMonth() &&
      viewDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateSelect = (d: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    setSelectedDate(newDate);
  };

  const nextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  const prevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));

  // Form details
  const [guestName, setGuestName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [occasion, setOccasion] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = localStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            setGuestName(user.fullName || "");
            setContactNumber(user.phone || "");
          }
        } catch (err) {
          console.error("Failed to load user data:", err);
        }
      }
    };
    fetchUser();
  }, []);

  const heroImage =
    restaurant.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=80";

  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const data = await api.get(
          `/reservations/availability?restaurantId=${restaurant.id}&date=${dateStr}&partySize=${partySize}`,
        );
        setBackendSlots(data.availability);

        const slot = data.availability.find(
          (s: any) => s.time === selectedTime,
        );
        if (slot) {
          setAvailableTables(slot.tables);
        } else if (data.availability.length > 0) {
          setSelectedTime(data.availability[0].time);
          setAvailableTables(data.availability[0].tables);
        } else {
          setAvailableTables([]);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [restaurant.id, partySize, selectedDate]);

  // Update available tables when time changes
  useEffect(() => {
    const slot = backendSlots.find((s: any) => s.time === selectedTime);
    if (slot) {
      setAvailableTables(slot.tables);
    }
  }, [selectedTime, backendSlots]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to make a reservation.");
      router.push(`/login?redirect=/restaurants/${restaurant.slug}/book`);
      return;
    }

    if (!selectedTable && availableTables.length > 0) {
      alert("Please select a table.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/reservations", {
        restaurantId: restaurant.id,
        tableId: selectedTable,
        guestName,
        contactNumber,
        partySize,
        reservationDate: selectedDate.toISOString().split("T")[0],
        reservationTime: selectedTime,
        occasion,
        specialRequests,
      });

      // Pass the booking data to the confirmation page
      localStorage.setItem("lastBooking", JSON.stringify(response));
      router.push("/booking-confirmed");
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-sm text-fly-orange">
        <Link href="/explore" className="text-fly-orange no-underline">
          Home
        </Link>
        {" > "}
        <Link
          href={`/restaurants/${restaurant.slug}`}
          className="text-fly-orange no-underline"
        >
          {restaurant.name}
        </Link>
        {" > Book a Table"}
      </p>

      <article className="mt-6 flex gap-4 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-lg font-bold text-white">
              {restaurant.name}
            </h1>
            <span className="rounded bg-[#22c55e] px-2 py-0.5 text-[0.6rem] font-black uppercase text-white">
              Open
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#888888]">
            {restaurant.cuisine}
            <span className="inline-flex items-center gap-0.5 font-bold text-fly-orange">
              <Star className="h-3 w-3 fill-fly-orange" />{" "}
              {restaurant.ratingAverage || "4.9"} (
              {restaurant.ratingCount || "0"})
            </span>
            · {restaurant.address || "Kigali, Rwanda"}
          </p>
        </div>
      </article>

      {/* Stepper */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
                i === 0
                  ? "bg-fly-orange text-white"
                  : "border border-[#333333] text-[#666666]"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden text-sm font-semibold sm:inline ${i === 0 ? "text-white" : "text-[#666666]"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 ? (
              <ChevronRight className="h-4 w-4 text-[#444444]" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Date & Time */}
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 shadow-2xl">
            <h2 className="m-0 text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-fly-orange" />
              Select Date & Time
            </h2>

            <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr]">
              {/* Custom Calendar */}
              <div className="rounded-2xl bg-[#0a0a0a] p-5 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="m-0 text-sm font-black uppercase tracking-widest text-white">
                    {monthName} {yearNum}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={prevMonth}
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/5 text-[#444] hover:text-white transition-all"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                      onClick={nextMonth}
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/5 text-[#444] hover:text-white transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <span
                      key={d}
                      className="text-[0.65rem] font-black text-[#333] mb-2"
                    >
                      {d}
                    </span>
                  ))}
                  {padding.map((p) => (
                    <div key={`p-${p}`} className="aspect-square" />
                  ))}
                  {days.map((d) => {
                    const selected = isSelected(d);
                    const today = isToday(d);
                    const date = new Date(yearNum, viewDate.getMonth(), d);
                    const isPast =
                      date < new Date(new Date().setHours(0, 0, 0, 0));

                    return (
                      <button
                        key={d}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDateSelect(d)}
                        className={`group relative aspect-square rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                          selected
                            ? "bg-fly-orange text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)] scale-110 z-10"
                            : isPast
                              ? "text-[#222] cursor-not-allowed"
                              : "text-[#666] hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {d}
                        {today && !selected && (
                          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-fly-orange" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between mb-5">
                  <p className="m-0 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#444]">
                    Available Time Slots
                  </p>
                  {loadingAvailability && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-fly-orange border-t-transparent" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {backendSlots.length > 0 ? (
                    backendSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`group relative rounded-xl border py-4 text-xs font-black uppercase tracking-widest transition-all ${
                          selectedTime === slot.time
                            ? "border-fly-orange bg-fly-orange/10 text-fly-orange shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                            : "border-white/5 bg-[#0a0a0a] text-[#444] hover:border-white/10 hover:text-[#888]"
                        }`}
                      >
                        {formatTime(slot.time)}
                        {slot.tablesLeft < 3 && slot.tablesLeft > 0 && (
                          <span className="absolute -top-2 -right-2 rounded-md bg-red-500/20 px-1.5 py-0.5 text-[0.5rem] font-black text-red-400 border border-red-500/30">
                            {slot.tablesLeft} LEFT
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-3 rounded-2xl border border-dashed border-white/5 py-12 text-center">
                      <p className="m-0 text-[0.7rem] font-black uppercase tracking-widest text-[#333]">
                        No availability for this date
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewDate(new Date())}
                        className="mt-4 text-[0.6rem] font-black uppercase tracking-widest text-fly-orange hover:underline"
                      >
                        Try another date
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-fly-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                    <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                      Selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#222]" />
                    <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Party size */}
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-fly-orange" />
                Party Size
              </h2>
              <label className="flex cursor-pointer items-center gap-3 text-xs font-black uppercase tracking-widest text-[#444] hover:text-[#666] transition-colors">
                Accessibility Needs
                <div
                  onClick={() => {
                    /* Toggle logic */
                  }}
                  className="relative h-6 w-11 rounded-full bg-[#222] transition-colors"
                >
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-[#444] transition-all" />
                </div>
              </label>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4 sm:grid-cols-8">
              {partySizes.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  className={`aspect-square rounded-2xl text-xl font-black transition-all ${
                    partySize === n
                      ? "bg-fly-orange text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] scale-110"
                      : "bg-[#0a0a0a] border border-white/5 text-[#444] hover:border-white/10 hover:text-white"
                  }`}
                >
                  {n === 8 ? "8+" : n}
                </button>
              ))}
            </div>
          </section>

          {/* Table selection */}
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 shadow-2xl">
            <h2 className="m-0 text-xl font-bold text-white flex items-center gap-2">
              <Table2 className="h-5 w-5 text-fly-orange" />
              Select Your Table
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableTables.length > 0 ? (
                availableTables.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTable(t.id)}
                    className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                      selectedTable === t.id
                        ? "border-fly-orange bg-fly-orange/5 shadow-[0_0_25px_rgba(249,115,22,0.1)]"
                        : "border-white/5 bg-[#0a0a0a] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong
                        className={`text-lg font-black ${selectedTable === t.id ? "text-fly-orange" : "text-white"}`}
                      >
                        T-{t.code}
                      </strong>
                      {selectedTable === t.id && (
                        <div className="rounded-full bg-fly-orange p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="m-0 text-[0.6rem] font-black uppercase tracking-widest text-[#444]">
                        {t.tableType}
                      </p>
                      <p className="m-0 text-[0.7rem] font-bold text-[#888]">
                        Up to {t.capacity} guests
                      </p>
                    </div>

                    {/* Visual representation of a table */}
                    <div className="mt-6 flex justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="h-8 w-12 rounded-lg border-2 border-white/20 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-4 w-2 rounded-sm border border-white/20" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-2 rounded-sm border border-white/20" />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-white/5 py-12 text-center">
                  <p className="m-0 text-[0.7rem] font-black uppercase tracking-widest text-[#333]">
                    No specific tables available for this slot
                  </p>
                  <p className="mt-2 text-xs text-[#555]">
                    We will assign the best available table for you.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Final details */}
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 shadow-2xl">
            <h2 className="m-0 text-xl font-bold text-white flex items-center gap-2">
              <Check className="h-5 w-5 text-fly-orange" />
              Final Details
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                  Guest Name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                  Contact Number
                </label>
                <input
                  type="tel"
                  className={inputClass}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+250 788 000 000"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                  Occasion
                </label>
                <select
                  className={inputClass}
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="">Select an occasion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business">Business</option>
                  <option value="Date">Date Night</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                  Special Requests
                </label>
                <textarea
                  className={`${inputClass} min-h-[120px] resize-none`}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Allergies, seating preferences, etc."
                />
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={loading}
              className="relative group w-full overflow-hidden rounded-2xl bg-fly-orange py-5 text-center text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_12px_40px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm Reservation
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </span>
            </button>
            <p className="mt-6 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[#333]">
              By confirming, you agree to our{" "}
              <span className="text-[#555] hover:text-white cursor-pointer underline">
                Booking Policy
              </span>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
            <Image
              src={heroImage}
              alt=""
              fill
              className="object-cover transition-transform duration-1000 hover:scale-110"
              sizes="340px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="rounded-lg bg-fly-orange/20 px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-fly-orange border border-fly-orange/30 backdrop-blur-md">
                {restaurant.cuisine}
              </span>
            </div>
          </div>

          <article className="rounded-2xl border border-white/5 bg-[#111111] p-6 shadow-2xl">
            <h2 className="m-0 text-lg font-bold text-white uppercase tracking-tighter">
              Reservation Summary
            </h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  icon: CalendarDays,
                  label: "Date",
                  value: selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }),
                },
                {
                  icon: CalendarDays,
                  label: "Time",
                  value: formatTime(selectedTime),
                },
                { icon: Users, label: "Guests", value: `${partySize} Persons` },
                {
                  icon: Table2,
                  label: "Table",
                  value: selectedTable
                    ? `T-${availableTables.find((t) => t.id === selectedTable)?.code || selectedTable}`
                    : "Best Available",
                },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0a0a0a] border border-white/5 text-fly-orange group-hover:scale-110 transition-transform">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                        {row.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#444]">
                  Deposit
                </span>
                <span className="text-sm font-bold text-[#22c55e]">Free</span>
              </div>
            </div>
          </article>

          <div className="rounded-2xl bg-fly-orange/5 border border-fly-orange/10 p-5">
            <p className="m-0 text-[0.65rem] font-medium leading-relaxed text-fly-orange/80">
              <Info className="h-4 w-4 inline mr-2 mb-1" />
              Tables are held for 15 minutes past reservation time. Please call
              if you're running late.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
