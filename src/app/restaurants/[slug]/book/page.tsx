"use client";

import { useEffect, useState } from "react";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { BookTableForm } from "@/components/customer/BookTableForm";
import Link from "next/link";

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

import { api } from "@/lib/api";

export default function DynamicBookTablePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        let data;
        try {
          data = await api.get(`/restaurants/${slug}`);
        } catch (err) {
          const list = await api.get("/restaurants");
          const found = list.find(
            (r: any) => r.slug.toLowerCase() === slug.toLowerCase(),
          );
          if (found) {
            data = await api.get(`/restaurants/${found.slug}`);
          } else {
            throw err;
          }
        }

        if (data) {
          setRestaurant(data);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant for booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slug]);

  if (loading) {
    return (
      <CustomerShell activeNav="Explore">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </CustomerShell>
    );
  }

  if (!restaurant) {
    return (
      <CustomerShell activeNav="Explore">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-black text-white">
            Restaurant Not Found
          </h1>
          <p className="mt-4 text-[#888]">
            We couldn't find the restaurant you want to book.
          </p>
          <Link
            href="/explore"
            className="mt-8 rounded-xl bg-fly-orange px-8 py-3 font-bold text-white no-underline"
          >
            Back to Discovery
          </Link>
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell
      activeNav="Explore"
      searchPlaceholder={`Book at ${restaurant.name}...`}
    >
      <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
        <BookTableForm restaurant={restaurant} />
      </div>
    </CustomerShell>
  );
}
