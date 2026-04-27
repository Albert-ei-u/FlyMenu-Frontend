"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSocket } from "@/context/SocketContext";
import {
  Download,
  EllipsisVertical,
  Filter,
  SlidersHorizontal,
  Utensils,
  Settings,
  Users,
  ChefHat,
  TrendingUp,
  TrendingDown,
  Archive,
} from "lucide-react";
import {
  AnimatedMetric,
  ChartBars,
  GlowCard,
  Reveal,
  Stagger,
} from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  adminPageTitleH1,
  adminPageTitleP,
  cardHeading,
  dashboardMainGrid,
  exportBtn,
  ghostTool,
  kpiGrid,
  mobileFilter,
  orderStatusClass,
  ordersTableHead,
  ordersTableRow,
  segmentActive,
  segmentControl,
  segmentIdle,
} from "@/components/admin/admin-ui";

interface DashboardData {
  salesTotal: number;
  totalOrders: number;
  totalCustomers: number;
  totalRestaurants: number;
  salesTrend: Array<{ label: string; value: number; actualValue: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customer?: { fullName: string; email: string };
    total: number;
    status: string;
    items: Array<{ name: string; quantity: number; unitPrice: number }>;
    createdAt: string;
  }>;
  recentReservations: Array<{
    id: string;
    guestName: string;
    partySize: number;
    reservationTime: string;
    status: string;
    createdAt: string;
  }>;
}

const defaultChartBars = [
  { label: "10AM", value: 35 },
  { label: "12PM", value: 55 },
  { label: "2PM", value: 85 },
  { label: "4PM", value: 45 },
  { label: "6PM", value: 95 },
  { label: "8PM", value: 75 },
];

const popularItems = [
  {
    name: "Zen Harvest Bowl",
    orders: "124 orders today",
    price: "$18.50",
    image: "/food1.png.png",
  },
  {
    name: "Blue Sky Burger",
    orders: "98 orders today",
    price: "$22.00",
    image: "/big-pizza-1.png.png",
  },
  {
    name: "Truffle Flight Pizza",
    orders: "84 orders today",
    price: "$26.00",
    image: "/chicken-french.png.png",
  },
  {
    name: "Propeller BBQ Ribs",
    orders: "76 orders today",
    price: "$29.50",
    image: "/banner-img-260x260.jpg.png",
  },
];

/* ─── Onboarding Empty State ─────────────────────────────────────────────── */
function OnboardingState({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const steps = [
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Add your first menu item",
      description: "Build your menu so customers know what you serve.",
      action: "Go to Menu",
      path: "/admin/menu-management",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Configure your restaurant",
      description: "Set your hours, location, and restaurant profile.",
      action: "Go to Settings",
      path: "/admin/settings",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Invite your staff",
      description: "Add team members to help manage orders and the kitchen.",
      action: "Go to Staff",
      path: "/admin/staff",
    },
  ];

  return (
    <Reveal delay={100}>
      <div className="mt-8 flex flex-col items-center text-center">
        {/* Hero greeting */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-fly-orange/10 text-fly-orange ring-1 ring-fly-orange/20">
          <ChefHat className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-black text-white">
          Welcome to FlyMenu! 🎉
        </h2>
        <p className="mt-3 max-w-[500px] text-[0.92rem] leading-relaxed text-[#a3a3a3]">
          Your restaurant dashboard is ready and waiting. Complete these quick
          setup steps to go live and start receiving orders.
        </p>

        {/* Steps */}
        <Stagger
          className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3"
          staggerMs={80}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`${adminCard} group flex flex-col items-start p-6 text-left transition hover:-translate-y-1`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-fly-orange/10 text-fly-orange">
                {step.icon}
              </div>
              <span className="mb-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-fly-orange">
                Step {i + 1}
              </span>
              <h3 className="mb-2 text-base font-bold text-white">
                {step.title}
              </h3>
              <p className="mb-5 flex-1 text-xs leading-relaxed text-[#888]">
                {step.description}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(step.path)}
                className="rounded-full bg-[#1a1a1a] px-5 py-2 text-xs font-bold tracking-wider text-white ring-1 ring-[#2f2f2f] transition group-hover:bg-fly-orange group-hover:ring-fly-orange"
              >
                {step.action} →
              </button>
            </div>
          ))}
        </Stagger>
      </div>
    </Reveal>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { socket } = useSocket();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/restaurant/login");
      return;
    }

    try {
      const resData = await api.get("/analytics/dashboard");
      setData(resData);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (!socket) return;

    socket.on("orders:update", () => {
      fetchDashboard();
    });

    socket.on("notifications:new", (notification: any) => {
      if (notification.type === "RESERVATION") {
        fetchDashboard();
      }
    });

    return () => {
      socket.off("orders:update");
      socket.off("notifications:new");
    };
  }, [socket, fetchDashboard]);

  if (loading) {
    return (
      <AdminShell active="Dashboard">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  const dashboardData = data || {
    salesTotal: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRestaurants: 0,
    salesTrend: defaultChartBars,
    recentOrders: [],
    recentReservations: [],
  };

  const trendData = dashboardData.salesTrend || defaultChartBars;

  const isEmptyState = dashboardData.totalOrders === 0;

  const kpis = [
    {
      label: "Today's Sales",
      value: dashboardData.salesTotal,
      prefix: "$",
      decimals: 2,
      delta: "+14%",
      glow: true,
    },
    { label: "Total Orders", value: dashboardData.totalOrders, delta: "+8.2%" },
    {
      label: "New Customers",
      value: dashboardData.totalCustomers,
      delta: "-2.1%",
      negative: true,
    },
  ];

  return (
    <AdminShell active="Dashboard">
      <div className={adminContent}>
        <Reveal blur>
          <div className="mb-8">
            <h1 className={adminPageTitleH1}>Dashboard Overview</h1>
            <p className={adminPageTitleP}>
              Precision insights for your flight menu performance today.
            </p>
          </div>
        </Reveal>

        {isEmptyState ? (
          <OnboardingState onNavigate={(path) => router.push(path)} />
        ) : (
          <>
            {/* KPIs */}
            <Stagger className={kpiGrid} staggerMs={90}>
              {kpis.map((kpi) =>
                kpi.glow ? (
                  <GlowCard
                    key={kpi.label}
                    className="p-6 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-fly-orange/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <p className="m-0 text-[0.65rem] font-bold uppercase tracking-wider text-[#888888]">
                      {kpi.label}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <AnimatedMetric
                        value={kpi.value}
                        prefix={kpi.prefix}
                        decimals={kpi.decimals ?? 0}
                        className="text-3xl font-black leading-none text-white"
                      />
                      <span className="text-xs font-bold text-[#22c55e] flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {kpi.delta}
                      </span>
                    </div>
                  </GlowCard>
                ) : (
                  <article
                    key={kpi.label}
                    className={`${adminCard} hover-lift p-6`}
                  >
                    <p className="m-0 text-[0.65rem] font-bold uppercase tracking-wider text-[#888888]">
                      {kpi.label}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <AnimatedMetric
                        value={kpi.value}
                        className="text-3xl font-black leading-none text-white"
                      />
                      <span
                        className={`text-xs font-bold flex items-center ${
                          kpi.negative ? "text-[#ef4444]" : "text-[#22c55e]"
                        }`}
                      >
                        {kpi.negative ? (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        )}
                        {kpi.delta}
                      </span>
                    </div>
                  </article>
                ),
              )}
            </Stagger>

            {/* Charts & Popular Items */}
            <div className={dashboardMainGrid}>
              <Reveal delay={100}>
                <article className={`${adminCard} hover-lift p-6 h-full`}>
                  <div className={cardHeading}>
                    <h2 className="m-0 text-lg font-bold text-white">
                      Sales Trend
                    </h2>
                    <div className={segmentControl}>
                      <button type="button" className={segmentActive}>
                        Hourly
                      </button>
                      <button type="button" className={segmentIdle}>
                        Daily
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 relative h-64">
                    {/* Layered Bar Effect */}
                    <div className="absolute inset-0 flex items-end justify-between gap-1 opacity-20 pointer-events-none translate-y-[-4px]">
                      {trendData.map((bar, i) => (
                        <div
                          key={`bg-${i}`}
                          className="flex flex-1 flex-col items-center gap-2"
                        >
                          <div
                            className="w-full max-w-[32px] rounded-t bg-fly-orange"
                            style={{ height: `${bar.value + 10}%` }}
                          />
                          <div className="h-4" />
                        </div>
                      ))}
                    </div>
                    <ChartBars
                      className="h-full border-0"
                      barClassName="max-w-[32px] z-10"
                      bars={trendData}
                    />
                  </div>
                </article>
              </Reveal>

              <Reveal delay={180}>
                <article
                  className={`${adminCard} hover-lift p-6 h-full flex flex-col`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="m-0 text-lg font-bold text-white leading-tight">
                      Popular Items
                    </h2>
                    <button className="text-[0.65rem] font-bold uppercase tracking-wider text-fly-orange hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="flex-1 space-y-5">
                    {dashboardData.recentOrders.length > 0 ? (
                      // Derive popular items from recent orders if possible
                      dashboardData.recentOrders
                        .flatMap((o) => o.items)
                        .slice(0, 4)
                        .map((item, idx) => (
                          <div
                            key={`${item.name}-${idx}`}
                            className="flex items-center gap-4 group"
                          >
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-[#262626] bg-[#1a1a1a] flex items-center justify-center">
                              <Utensils className="h-5 w-5 text-[#333]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-white truncate">
                                {item.name}
                              </h3>
                              <p className="text-[0.65rem] font-medium text-[#666666]">
                                Recent order
                              </p>
                            </div>
                            <span className="text-sm font-black text-white">
                              ${Number(item.unitPrice).toFixed(2)}
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 text-[#444] gap-2">
                        <Archive className="h-8 w-8" />
                        <p className="text-xs font-bold uppercase tracking-widest">
                          No Items Yet
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            </div>

            {/* Recent Orders Table */}
            <Reveal className="mt-6" delay={200}>
              <section className={`${adminCard} hover-lift overflow-hidden`}>
                <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                  <h2 className="m-0 text-xl font-bold text-white">
                    Recent Orders
                  </h2>
                  <div className="flex gap-3">
                    <button type="button" className={ghostTool}>
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                    <button type="button" className={exportBtn}>
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[850px]">
                    <div className="grid grid-cols-[1.2fr_1.5fr_2fr_1fr_1.2fr_0.5fr] gap-4 px-6 py-4 text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                      <span>Order ID</span>
                      <span>Customer</span>
                      <span>Items</span>
                      <span>Price</span>
                      <span>Status</span>
                      <span>Actions</span>
                    </div>
                    <div className="divide-y divide-[#262626]">
                      {dashboardData.recentOrders.length === 0 ? (
                        <div className="p-10 text-center text-sm text-[#555]">
                          No orders yet. Once customers start ordering, they
                          will appear here.
                        </div>
                      ) : (
                        dashboardData.recentOrders.map((order, i) => (
                          <Reveal key={order.id} delay={i * 55} direction="up">
                            <div className="grid grid-cols-[1.2fr_1.5fr_2fr_1fr_1.2fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-[#1f1f1f]">
                              <strong className="font-mono text-sm text-white">
                                #
                                {order.orderNumber ||
                                  order.id.slice(-8).toUpperCase()}
                              </strong>
                              <div className="flex items-center gap-3">
                                <i
                                  className={`grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-[0.65rem] font-black not-italic text-fly-orange`}
                                >
                                  {(
                                    order.customer?.fullName ||
                                    order.customerName ||
                                    "?"
                                  )
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </i>
                                <span className="text-sm font-bold text-white">
                                  {order.customer?.fullName ||
                                    order.customerName}
                                </span>
                              </div>
                              <span className="text-xs text-[#9a9a9a] truncate">
                                {order.items
                                  .map(
                                    (item) => `${item.quantity}x ${item.name}`,
                                  )
                                  .join(", ")}
                              </span>
                              <strong className="text-sm font-black text-white">
                                ${(Number(order.total) || 0).toFixed(2)}
                              </strong>
                              <div>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.6rem] font-black tracking-wider ${
                                    order.status === "DELIVERED"
                                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                      : order.status === "PREPARING"
                                        ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                        : order.status === "ON_ROUTE" ||
                                            order.status === "ON ROUTE"
                                          ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                          : order.status === "CANCELLED"
                                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                            : "bg-[#262626] text-[#888888] border border-[#333333]"
                                  }`}
                                >
                                  {order.status.replace("_", " ")}
                                </span>
                              </div>
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666666] transition hover:bg-[#262626] hover:text-white"
                              >
                                <EllipsisVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </Reveal>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            {/* Recent Reservations Table */}
            <Reveal className="mt-6" delay={250}>
              <section className={`${adminCard} hover-lift overflow-hidden`}>
                <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                  <h2 className="m-0 text-xl font-bold text-white">
                    Recent Reservations
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[850px]">
                    <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-6 py-4 text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]">
                      <span>Guest Name</span>
                      <span>Party Size</span>
                      <span>Date & Time</span>
                      <span>Status</span>
                      <span>Booked On</span>
                      <span>Actions</span>
                    </div>
                    <div className="divide-y divide-[#262626]">
                      {!dashboardData.recentReservations ||
                      dashboardData.recentReservations.length === 0 ? (
                        <div className="p-10 text-center text-sm text-[#555]">
                          No reservations yet.
                        </div>
                      ) : (
                        dashboardData.recentReservations.map((res, i) => (
                          <Reveal key={res.id} delay={i * 55} direction="up">
                            <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-[#1f1f1f]">
                              <div className="flex items-center gap-3">
                                <i className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-[0.65rem] font-black not-italic text-fly-orange">
                                  {res.guestName.slice(0, 2).toUpperCase()}
                                </i>
                                <span className="text-sm font-bold text-white">
                                  {res.guestName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white">
                                <Users className="h-4 w-4 text-[#666666]" />
                                {res.partySize} Guests
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-bold text-white">
                                  {res.reservationTime}
                                </span>
                                <span className="text-[0.65rem] text-[#666666]">
                                  {new Date(res.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                <span className="inline-flex items-center rounded-full bg-[#22c55e]/10 px-2.5 py-1 text-[0.6rem] font-black tracking-wider text-[#22c55e] border border-[#22c55e]/20">
                                  {res.status}
                                </span>
                              </div>
                              <span className="text-xs text-[#9a9a9a]">
                                {new Date(res.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666666] transition hover:bg-[#262626] hover:text-white"
                              >
                                <EllipsisVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </Reveal>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>
          </>
        )}
      </div>
    </AdminShell>
  );
}
