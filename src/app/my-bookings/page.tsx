"use client";

import { useEffect, useState } from "react";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Reveal, Stagger } from "@/components/motion/Reveal";
import { CalendarDays, MapPin, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Reservation {
  id: string;
  confirmationNumber: string;
  guestName: string;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  status: string;
  restaurant: {
    name: string;
    slug: string;
    media: { url: string }[];
  };
}

import { api } from "@/lib/api";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get("/reservations/list");
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <CustomerShell activeNav="My Bookings">
      <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-8">
        <Reveal blur>
          <h1 className="m-0 text-4xl font-black text-white uppercase italic">
            My Reservations
          </h1>
          <p className="mt-2 text-[#888]">
            Track and manage your upcoming elite dining experiences.
          </p>
        </Reveal>

        <div className="mt-12">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
            </div>
          ) : bookings.length === 0 ? (
            <Reveal blur>
              <div className="rounded-[2rem] border border-dashed border-[#262626] bg-[#0d0d0d] p-20 text-center">
                <CalendarDays className="mx-auto h-12 w-12 text-[#222]" />
                <h2 className="mt-6 text-xl font-bold text-white">
                  No Bookings Found
                </h2>
                <p className="mt-2 text-[#666]">
                  You haven't made any reservations yet.
                </p>
                <Link
                  href="/explore"
                  className="mt-8 inline-block rounded-xl bg-fly-orange px-8 py-3 font-bold text-white no-underline"
                >
                  Discover Restaurants
                </Link>
              </div>
            </Reveal>
          ) : (
            <Stagger className="grid gap-6" staggerMs={80}>
              {bookings.map((booking) => (
                <Reveal key={booking.id} direction="up">
                  <div className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#111111] p-6 transition-all hover:border-fly-orange/30">
                    <div className="flex flex-wrap gap-8 md:flex-nowrap">
                      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl md:w-48">
                        <Image
                          src={
                            booking.restaurant.media?.[0]?.url ||
                            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80"
                          }
                          alt={booking.restaurant.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="m-0 text-xl font-bold text-white">
                              {booking.restaurant.name}
                            </h3>
                            <span className="rounded-lg bg-[#22c55e]/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-[#22c55e] border border-[#22c55e]/20">
                              {booking.status}
                            </span>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-y-3 sm:grid-cols-4">
                            <div className="flex items-center gap-2 text-sm text-[#888]">
                              <CalendarDays className="h-4 w-4 text-fly-orange" />
                              {new Date(
                                booking.reservationDate,
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#888]">
                              <span className="font-bold text-white">
                                {booking.reservationTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#888]">
                              <span className="font-bold text-white">
                                {booking.partySize} Persons
                              </span>
                            </div>
                            <div className="text-right text-[0.65rem] font-mono text-[#444]">
                              REF: {booking.confirmationNumber}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-[#1a1a1a] pt-6">
                          <Link
                            href={`/restaurants/${booking.restaurant.slug}`}
                            className="text-[0.65rem] font-black uppercase tracking-widest text-fly-orange no-underline hover:underline"
                          >
                            View Restaurant
                          </Link>
                          <div className="flex gap-3">
                            <button className="rounded-lg border border-[#333] px-4 py-2 text-[0.65rem] font-black uppercase tracking-widest text-[#888] hover:bg-white/5 transition-colors">
                              Cancel
                            </button>
                            <button className="rounded-lg bg-fly-orange/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-widest text-fly-orange hover:bg-fly-orange hover:text-white transition-colors">
                              Modify
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </CustomerShell>
  );
}
