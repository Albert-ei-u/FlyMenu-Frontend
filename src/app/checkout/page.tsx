"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Reveal } from "@/components/motion/Reveal";
import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  MapPin,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, restaurantId, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCustomerName(user.fullName || "");
      setCustomerPhone(user.phone || "");
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !restaurantId) return;

    if (!customerName || !customerPhone || !address) {
      alert("Please fill in all delivery details.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/orders", {
        restaurantId,
        customerName,
        customerPhone,
        total: Number(total || 0) + 2.5,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice || 0),
        })),
      });

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push("/orders/tracking");
      }, 3000);
    } catch (err: any) {
      console.error("Checkout failed:", err);
      alert(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <CustomerShell activeNav="Explore" searchPlaceholder="Search cuisines...">
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <Reveal blur>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-6 text-3xl font-black text-white">
              Order Placed Successfully!
            </h1>
            <p className="mt-3 text-[#888888]">
              Your order has been received by the restaurant and is being
              prepared.
            </p>
            <p className="mt-8 text-sm text-fly-orange">
              Redirecting to order tracking...
            </p>
          </Reveal>
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell activeNav="Explore" searchPlaceholder="Search cuisines...">
      <div className="mx-auto max-w-[1000px] px-5 py-10 lg:px-8">
        <Link
          href="/restaurants/obsidian-grill"
          className="flex items-center gap-2 text-sm font-bold text-fly-orange no-underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Restaurant
        </Link>

        <h1 className="mt-8 text-4xl font-black text-white">Checkout</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <Reveal direction="up">
              <section className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
                <h2 className="m-0 flex items-center gap-3 text-lg font-bold text-white">
                  <MapPin className="h-5 w-5 text-fly-orange" />
                  Delivery Details
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#666666]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#333333] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-0 focus:border-fly-orange"
                      />
                    </div>
                    <div>
                      <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#666666]">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#333333] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-0 focus:border-fly-orange"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#666666]">
                      Delivery Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-2 h-24 w-full rounded-xl border border-[#333333] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-0 focus:border-fly-orange"
                      placeholder="Enter your full address..."
                    ></textarea>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <section className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
                <h2 className="m-0 flex items-center gap-3 text-lg font-bold text-white">
                  <CreditCard className="h-5 w-5 text-fly-orange" />
                  Payment Method
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="flex items-center gap-4 rounded-xl border border-fly-orange bg-[#1a1208] p-4 text-left"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-fly-orange/10 text-fly-orange">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-sm text-white">
                        Credit Card
                      </strong>
                      <span className="text-[0.65rem] text-fly-orange">
                        Selected
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-4 rounded-xl border border-[#333333] bg-[#0a0a0a] p-4 text-left"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#222] text-[#666]">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-sm text-[#888]">
                        Cash on Delivery
                      </strong>
                      <span className="text-[0.65rem] text-[#444]">
                        Available
                      </span>
                    </div>
                  </button>
                </div>
              </section>
            </Reveal>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
              <h2 className="m-0 text-lg font-bold text-white">
                Order Summary
              </h2>
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-[#888888]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-white">
                      $
                      {(item.quantity * Number(item.unitPrice || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-[#2a2a2a] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Subtotal</span>
                    <span className="font-bold text-white">
                      ${Number(total || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-[#666666]">Service Fee</span>
                    <span className="font-bold text-white">$2.50</span>
                  </div>
                  <div className="mt-4 flex justify-between text-lg font-black text-white">
                    <span>Total</span>
                    <span className="text-fly-orange">
                      ${(Number(total || 0) + 2.5).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                className="mt-8 w-full rounded-2xl bg-fly-orange py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </CustomerShell>
  );
}
