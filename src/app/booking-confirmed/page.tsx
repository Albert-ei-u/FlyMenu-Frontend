"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, CalendarPlus, Info, List, MapPin, Table2, Users, Utensils } from "lucide-react";

export default function BookingConfirmedPage() {
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("lastBooking");
    if (data) {
      setBooking(JSON.parse(data));
    }
  }, []);

  if (!booking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#1f0f08]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
      </div>
    );
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  const reservationDate = new Date(booking.reservationDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (    <main className="min-h-dvh bg-[#1f0f08] px-6 py-10 text-[#ffe8dc] sm:px-10">
      <section className="mx-auto flex max-w-[920px] flex-col items-center">
        <Image
          src="/flymenu-logo.png"
          alt="FlyMenu logo"
          width={92}
          height={92}
          priority
          className="animate-scale-in drop-shadow-[0_0_24px_rgba(249,115,22,0.14)]"
        />

        <header className="mt-5 text-center">
          <h1 className="text-[clamp(2.4rem,6vw,3.25rem)] font-black tracking-[-0.02em] text-[#ffe8dc]">
            Booking Confirmed!
          </h1>
          <p className="mt-3 text-lg text-[#d8c2b8]">Your table at {booking.restaurant.name} is ready for you.</p>
        </header>

        <div className="mt-16 grid w-full gap-6 lg:grid-cols-2">
          <article className="flex min-h-[400px] flex-col items-center justify-center rounded-[10px] border border-[#6d4433] bg-[#302016] p-8 text-center sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d8c2b8]">Confirmation Number</p>
            <p className="mt-4 text-[2rem] font-black tracking-[0.02em] text-fly-orange">{booking.confirmationNumber}</p>

            <div className="mt-7 grid h-[208px] w-[208px] place-items-center rounded-lg bg-white" aria-label="QR code">
              <div className="relative grid h-[160px] w-[160px] place-items-center bg-[#071013]">
                <span className="absolute h-[45px] w-[45px] bg-[linear-gradient(90deg,#111_50%,transparent_50%),linear-gradient(#111_50%,transparent_50%)] bg-[length:10px_10px] bg-white" />
                <span className="h-[118px] w-[72px] rounded-[18px] border-[7px] border-white bg-[linear-gradient(90deg,#111_25%,transparent_25%_75%,#111_75%),linear-gradient(#111_25%,transparent_25%_75%,#111_75%)] bg-[length:18px_18px] bg-white" />
              </div>
            </div>

            <p className="mt-7 text-sm text-[#d8c2b8]">Show this QR code upon arrival at the host stand.</p>
          </article>

          <article className="min-h-[400px] rounded-[10px] border border-[#6d4433] bg-[#302016] p-8 sm:p-10">
            <h2 className="text-2xl font-black text-fly-peach">Reservation Details</h2>

            <dl className="mt-6 space-y-6">
              {[
                { icon: Utensils, label: "Restaurant", value: booking.restaurant.name },
                { icon: CalendarDays, label: "Date & Time", value: `${reservationDate} at ${formatTime(booking.reservationTime)}` },
                { icon: Users, label: "Guests", value: `${booking.partySize} Persons` },
                { icon: Table2, label: "Assigned Table", value: booking.table ? `Table ${booking.table.code} (${booking.table.tableType})` : "Standard Seating" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="grid grid-cols-[24px_1fr] gap-[1.1rem] text-fly-orange">
                    <Icon className="mt-0.5 h-[22px] w-[22px]" />
                    <span>
                      <dt className="text-[0.72rem] text-[#d8c2b8]">{row.label}</dt>
                      <dd className="m-0 mt-1 font-black text-[#ffe8dc]">{row.value}</dd>
                    </span>
                  </div>
                );
              })}
            </dl>

            <div className="mt-9 border-t border-[#6d4433] pt-7 text-center">
              <Link 
                href="/my-bookings"
                className="inline-flex items-center gap-2 rounded-xl bg-fly-orange px-8 py-3 font-bold text-white no-underline"
              >
                View My Bookings
              </Link>
            </div>
          </article>
        </div>
        
        <div className="mt-12 text-center">
           <Link href="/explore" className="text-[#d8c2b8] hover:text-white">
              Back to Home
           </Link>
        </div>
      </section>
    </main>
  );
}
