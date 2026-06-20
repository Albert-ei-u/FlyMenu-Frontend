"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChefHat,
  ChevronRight,
  MessageCircle,
  Phone,
  Plus,
  Star,
  Wine,
} from "lucide-react";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Reveal } from "@/components/motion/Reveal";
import { api } from "@/lib/api";

export default function OrderTrackingPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(4);

  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Great Presentation",

  ]);

  useEffect(() => {



    
    const fetchLatestOrder = async () => {
      try {
        const orders = await api.get("/orders");
        if (orders && orders.length > 0) {
          // Get the most recent order
          const latest = await api.get(`/orders/${orders[0].id}`);
          setOrder(latest);
        }
      } catch (err) {
        console.error("Failed to fetch order tracking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, []);

  if (loading) {
    return (
      <CustomerShell activeNav="Explore" searchPlaceholder="Search orders...">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </CustomerShell>
    );
  }

  if (!order) {
    return (
      <CustomerShell activeNav="Explore" searchPlaceholder="Search orders...">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-2xl font-black text-white">
            No active orders found
          </h1>
          <Link
            href="/explore"
            className="mt-4 text-fly-orange hover:underline"
          >
            Start shopping
          </Link>
        </div>
      </CustomerShell>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CustomerShell activeNav="Explore" searchPlaceholder="Search orders...">
      <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="m-0 text-2xl font-black text-white">
                Order Tracking
              </h1>
              <p className="mt-1 text-sm text-[#888888]">
                ID: {order.orderNumber} · Status:{" "}
                <span className="text-fly-orange font-bold">
                  {order.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-[#333333] px-4 py-2.5 text-sm font-bold text-[#bdbdbd]"
              >
                Help Center
              </button>
              <button
                type="button"
                className="rounded-lg bg-fly-orange px-4 py-2.5 text-sm font-bold text-white"
              >
                Contact Restaurant
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Left sidebar */}
          <div className="space-y-6">
            <article className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
              <h2 className="m-0 font-bold text-white">Order Summary</h2>
              <ul className="mt-4 list-none space-y-4 p-0">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#0a0a0a]">
                      <ChefHat className="m-auto h-6 w-6 text-[#222]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-sm text-white">
                        {item.name}
                      </strong>
                      <span className="text-xs text-[#666666]">
                        Qty {item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      ${Number(item.unitPrice).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-[#2a2a2a] pt-4 text-sm">
                <div className="flex justify-between text-[#888888]">
                  <dt>Subtotal</dt>
                  <dd className="m-0 text-white">
                    ${Number(order.subtotal).toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <dt>Service Fee</dt>
                  <dd className="m-0 text-white">$2.50</dd>
                </div>
                <div className="flex justify-between pt-2 text-base font-black">
                  <dt className="text-white">Total</dt>
                  <dd className="m-0 text-fly-orange">
                    ${Number(order.total).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          {/* Main tracking */}
          <div className="space-y-6">
            <article className="hover-lift rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
              <div className="flex items-center justify-between">
                <h2 className="m-0 font-bold text-white">Live Updates</h2>
                <span className="animate-pulse rounded-full bg-[#1a1208] px-3 py-1 text-[0.65rem] font-black uppercase text-fly-orange motion-reduce:animate-none">
                  {order.status}
                </span>
              </div>
              <ul className="mt-6 list-none space-y-6 p-0">
                {order.trackingEvents.map((event: any, i: number) => (
                  <li key={event.id} className="flex gap-4">
                    <span
                      className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fly-orange`}
                    >
                      <ChefHat className="h-4 w-4 text-white" />
                    </span>
                    <div>
                      <strong className="block text-sm text-white">
                        {event.title}
                      </strong>
                      <span className="text-xs text-[#666666]">
                        {formatTime(event.createdAt)}
                      </span>
                      {event.message ? (
                        <p className="mt-1 m-0 text-sm text-[#888888]">
                          {event.message}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
              <h2 className="m-0 font-bold text-white">
                How&apos;s your experience so far?
              </h2>
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    aria-label={`Rate ${i + 1} stars`}
                    className="border-0 bg-transparent p-0"
                  >
                    <Star
                      className={`h-8 w-8 ${i < rating ? "fill-fly-orange text-fly-orange" : "text-[#333333]"}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Tell us more about your experience..."
                className="mt-4 min-h-[100px] w-full resize-y rounded-lg border border-[#333333] bg-[#0a0a0a] p-3 text-sm text-white outline-0"
              />
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-fly-orange py-3 text-sm font-black uppercase text-white"
              >
                Submit Feedback
              </button>
            </article>
          </div>
        </div>
      </div>
    </CustomerShell>
  );
}
