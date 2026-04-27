"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import {
  Clock3,
  Filter,
  MoreHorizontal,
  Navigation,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import { Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminContent, mobileFilter } from "@/components/admin/admin-ui";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
  etaMinutes?: number;
}

import { api } from "@/lib/api";

export default function OrdersPage() {
  const router = useRouter();
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    socket.on("orders:update", (payload: { order: Order }) => {
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === payload.order.id);
        if (index > -1) {
          const newOrders = [...prev];
          newOrders[index] = payload.order;
          return newOrders;
        }
        return [payload.order, ...prev];
      });
    });

    return () => {
      socket.off("orders:update");
    };
  }, [socket]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/restaurant/login");
        return;
      }

      try {
        const data = await api.get("/orders");
        setOrders(data);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o)),
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  if (loading) {
    return (
      <AdminShell active="Orders">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  const pending = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED",
  );
  const preparing = orders.filter((o) => o.status === "PREPARING");
  const ready = orders.filter(
    (o) => o.status === "READY" || o.status === "DELIVERED",
  );

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "JUST NOW";
    return `${mins} MIN AGO`;
  };
  return (
    <AdminShell active="Orders" searchPlaceholder="Search menu items...">
      <div className={`${adminContent} min-h-screen`}>
        <Reveal blur>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#262626] pb-6">
            <div>
              <p className="m-0 text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
                Management <span className="mx-2 text-[#555]">&gt;</span>{" "}
                <strong className="text-fly-orange">Live Tracking</strong>
              </p>
              <h1 className="m-0 mt-2 text-3xl font-black text-white tracking-tight">
                Order Board
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#111] bg-[#333] text-[0.65rem] font-bold text-white">
                  JD
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#111] bg-fly-orange text-[0.65rem] font-bold text-white">
                  AS
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#111] bg-[#222] text-[0.65rem] font-bold text-[#888]">
                  +4
                </div>
              </div>
              <button
                type="button"
                className="ml-2 flex items-center gap-2 rounded-xl border border-[#333] bg-transparent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#222]"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </Reveal>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* PENDING COLUMN */}
          <Reveal direction="left" delay={80}>
            <div className="flex flex-col gap-4">
              <header className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
                  <h2 className="m-0 text-base font-medium text-white">
                    Pending
                  </h2>
                  <span className="grid h-5 w-7 place-items-center rounded bg-[#eab308]/20 text-[0.65rem] font-bold text-[#eab308]">
                    {pending.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <MoreHorizontal className="h-5 w-5 text-[#666]" />
              </header>

              <Stagger staggerMs={90} className="flex flex-col gap-4">
                {pending.map((order, i) => (
                  <article
                    key={order.id}
                    className="flex flex-col rounded-xl border border-[#262626] border-l-4 border-l-[#eab308] bg-[#141414] p-5 shadow-lg transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#a1a1aa] font-medium tracking-wide">
                        #{order.orderNumber}
                      </strong>
                      <span className="font-semibold text-[#888] uppercase tracking-wider">
                        {getTimeAgo(order.createdAt)}
                      </span>
                    </div>
                    <h3 className="m-0 mt-3 text-lg font-medium text-white tracking-wide">
                      {order.customerName}
                    </h3>
                    <div className="mt-2 flex-1">
                      {order.items.map((item, idx) => (
                        <p
                          key={idx}
                          className="m-0 mt-1 text-[0.8rem] text-[#888888]"
                        >
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                    <footer className="mt-5 flex items-end justify-between border-t border-[#262626] pt-4">
                      <b className="text-xl font-bold text-white tracking-wide">
                        ${Number(order.total).toFixed(2)}
                      </b>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(order.id, "PREPARING")
                        }
                        className="rounded-lg bg-[#eab308] px-4 py-1.5 text-[0.7rem] font-black text-black transition-opacity hover:opacity-90"
                      >
                        CONFIRM
                      </button>
                    </footer>
                  </article>
                ))}
              </Stagger>
            </div>
          </Reveal>

          {/* PREPARING COLUMN */}
          <Reveal direction="up" delay={160}>
            <div className="flex flex-col gap-4">
              <header className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                  <h2 className="m-0 text-base font-medium text-white">
                    Preparing
                  </h2>
                  <span className="grid h-5 w-7 place-items-center rounded bg-[#3b82f6]/20 text-[0.65rem] font-bold text-[#3b82f6]">
                    {preparing.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <MoreHorizontal className="h-5 w-5 text-[#666]" />
              </header>

              <Stagger staggerMs={90} className="flex flex-col gap-4">
                {preparing.map((order, i) => (
                  <article
                    key={order.id}
                    className="flex flex-col rounded-xl border border-[#262626] border-l-4 border-l-[#3b82f6] bg-[#141414] p-5 shadow-lg transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#a1a1aa] font-medium tracking-wide">
                        #{order.orderNumber}
                      </strong>
                      <div className="flex items-center gap-2 text-[#3b82f6]">
                        <Clock3 className="h-3 w-3" />
                        <span className="font-bold uppercase tracking-wider">
                          {order.etaMinutes || 15} MIN
                        </span>
                      </div>
                    </div>
                    <h3 className="m-0 mt-3 text-lg font-medium text-white tracking-wide">
                      {order.customerName}
                    </h3>
                    <div className="mt-2 flex-1">
                      {order.items.map((item, idx) => (
                        <p
                          key={idx}
                          className="m-0 mt-1 text-[0.8rem] text-[#888888]"
                        >
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                    <footer className="mt-5 flex items-end justify-between border-t border-[#262626] pt-4">
                      <b className="text-xl font-bold text-white tracking-wide">
                        ${Number(order.total).toFixed(2)}
                      </b>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, "READY")}
                        className="rounded-lg bg-[#3b82f6] px-4 py-1.5 text-[0.7rem] font-black text-white transition-opacity hover:opacity-90"
                      >
                        READY
                      </button>
                    </footer>
                  </article>
                ))}
              </Stagger>
            </div>
          </Reveal>

          {/* READY COLUMN */}
          <Reveal direction="right" delay={240}>
            <div className="flex flex-col gap-4">
              <header className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                  <h2 className="m-0 text-base font-medium text-white">
                    Ready
                  </h2>
                  <span className="grid h-5 w-7 place-items-center rounded bg-[#22c55e]/20 text-[0.65rem] font-bold text-[#22c55e]">
                    {ready.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <MoreHorizontal className="h-5 w-5 text-[#666]" />
              </header>

              <Stagger staggerMs={90} className="flex flex-col gap-4">
                {ready.map((order, i) => (
                  <article
                    key={order.id}
                    className="flex flex-col rounded-xl border border-[#262626] border-l-4 border-l-[#22c55e] bg-[#141414] p-5 shadow-lg transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#a1a1aa] font-medium tracking-wide">
                        #{order.orderNumber}
                      </strong>
                      <span className="rounded bg-[#22c55e]/10 px-2 py-0.5 font-black text-[#22c55e]">
                        READY
                      </span>
                    </div>
                    <h3 className="m-0 mt-3 text-lg font-medium text-white tracking-wide">
                      {order.customerName}
                    </h3>
                    <div className="mt-2 flex-1 text-[0.8rem] text-[#888888]">
                      {order.items
                        .map((item) => `${item.quantity}x ${item.name}`)
                        .join(", ")}
                    </div>
                    <footer className="mt-5 flex items-end justify-between border-t border-[#262626] pt-4">
                      <b className="text-xl font-bold text-white tracking-wide">
                        ${Number(order.total).toFixed(2)}
                      </b>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(order.id, "COMPLETED")
                        }
                        className="rounded-lg bg-[#22c55e] px-4 py-1.5 text-[0.7rem] font-black text-white transition-opacity hover:opacity-90"
                      >
                        COMPLETE
                      </button>
                    </footer>
                  </article>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </section>
      </div>

      <button
        type="button"
        className={mobileFilter}
        aria-label="Order controls"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </AdminShell>
  );
}
