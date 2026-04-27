/** Shared Tailwind class strings for admin pages */

export const adminContent = "p-8 max-lg:p-4";

export const adminSection = "mt-6";

export const kpiGrid = "mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3";

export const dashboardMainGrid =
  "mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)]";

export const menuGrid = "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4";

export const menuStatsGrid = "mt-8 grid grid-cols-1 gap-4 md:grid-cols-3";

export const kanbanGrid = "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3";

export const cardHeading = "flex flex-wrap items-center justify-between gap-3";

export const segmentControl =
  "flex rounded-lg border border-[#333333] p-0.5 [&>button]:rounded-md [&>button]:px-3 [&>button]:py-1.5 [&>button]:text-xs [&>button]:font-bold [&>button]:transition-all [&>button]:duration-300";

export const segmentActive = "bg-fly-orange text-white";

export const segmentIdle = "text-[#888888] hover:text-[#bdbdbd]";

export const menuTabRow =
  "mt-6 flex flex-wrap gap-2 [&>button]:rounded-full [&>button]:border [&>button]:px-4 [&>button]:py-2 [&>button]:text-sm [&>button]:font-bold [&>button]:transition-all [&>button]:duration-300";

export const menuTabActive = "border-fly-orange bg-fly-orange text-white";

export const menuTabIdle = "border-[#333333] bg-transparent text-[#888888] hover:border-[#555555]";

export const ordersTableHead =
  "grid grid-cols-[1fr_1.2fr_1.4fr_0.7fr_0.9fr_0.4fr] gap-3 border-b border-[#262626] px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#666666]";

export const ordersTableRow =
  "grid grid-cols-[1fr_1.2fr_1.4fr_0.7fr_0.9fr_0.4fr] items-center gap-3 border-b border-[#262626]/80 px-4 py-4 text-sm transition-colors last:border-0 hover:bg-[#141414]/60";

export const kanbanColumn = (tone: "pending" | "preparing" | "ready") => {
  const accent =
    tone === "pending"
      ? "border-t-fly-orange"
      : tone === "preparing"
        ? "border-t-[#3b82f6]"
        : "border-t-[#22c55e]";
  return `flex max-h-[calc(100dvh-220px)] min-h-[420px] flex-col rounded-xl border border-[#262626] border-t-4 bg-[#141414] ${accent}`;
};

export const orderTicket =
  "hover-lift mb-3 rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-transform";

export const settingsGrid = "mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2";

export const staffKpiGrid = "mt-8 grid grid-cols-1 gap-4 md:grid-cols-3";

export const settingsField =
  "mt-1.5 w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2.5 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange";

export const settingsLabel = "block text-xs font-bold uppercase tracking-wider text-[#888888]";

export const settingsTwoCol = "grid gap-4 sm:grid-cols-2";

export const settingsThreeCol = "grid gap-4 sm:grid-cols-3";

export const opsGrid = "mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr_1.1fr]";

export const clientKpiGrid = "mt-8 grid grid-cols-1 gap-4 md:grid-cols-3";

export const clientLayout = "mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_320px]";

export const adminPageTitle = "admin-page-title";

export const adminPageTitleH1 =
  "m-0 text-[clamp(2rem,3vw,2.25rem)] font-black tracking-[-0.03em] text-white";

export const adminPageTitleP = "mt-[0.45rem] text-[#9a9a9a]";

export const adminCard =
  "rounded-[14px] border border-[#262626] bg-[#1a1a1a] shadow-[0_18px_48px_rgba(0,0,0,0.18)] [background-image:radial-gradient(circle_at_88%_0%,rgba(255,255,255,0.03),transparent_12rem)]";

export const titleRow = "flex items-start justify-between gap-6";

export const ghostTool =
  "inline-flex min-h-[34px] items-center gap-[0.45rem] rounded-lg border-0 bg-[#262626] px-[0.85rem] font-black text-[#555555]";

export const exportBtn =
  "inline-flex min-h-[34px] items-center gap-[0.45rem] rounded-lg border-0 bg-fly-orange px-[0.85rem] font-black text-white";

export const secondaryAction =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[#2f2f2f] bg-[#151515] px-[1.4rem] font-bold text-fly-fog no-underline";

export const primaryAction =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border-0 bg-fly-orange px-[1.4rem] font-bold text-[#fff8f2] no-underline shadow-[0_16px_34px_rgba(249,115,22,0.18)]";

export const mobileFilter =
  "fixed bottom-4 right-4 z-20 hidden h-[46px] w-[46px] place-items-center rounded-full border border-[#443228] bg-fly-orange text-white max-lg:grid";

export const foodOrb: Record<string, string> = {
  salad:
    "h-12 w-12 rounded-full border-[3px] border-[#262626] bg-[radial-gradient(circle,#e6ffe1_0_24%,#54ad46_25%_38%,#f6f1ca_39%_55%,#1f3a22_56%)]",
  burger:
    "h-12 w-12 rounded-full border-[3px] border-[#262626] bg-[linear-gradient(#d28b2d_0_22%,#27160e_23%_42%,#2ca652_43%_52%,#b73823_53%_68%,#d28b2d_69%)]",
  pizza:
    "h-12 w-12 rounded-full border-[3px] border-[#262626] bg-[radial-gradient(circle,#f7d06b_0_45%,#b92020_46%_55%,#f0c46a_56%)]",
  ribs: "h-12 w-12 rounded-full border-[3px] border-[#262626] bg-[repeating-linear-gradient(135deg,#f3d4c1_0_8px,#7b1d17_9px_19px)]",
};

export const orderStatusClass = (status: string) => {
  const key = status.toLowerCase().replace(" ", "-");
  const base =
    "w-fit rounded-full px-[0.7rem] py-[0.22rem] text-[0.68rem] font-black uppercase";
  if (key === "delivered") return `${base} bg-[rgba(34,197,94,0.12)] text-[#22c55e]`;
  if (key === "cancelled") return `${base} bg-[rgba(239,68,68,0.14)] text-[#ef4444]`;
  return `${base} bg-[rgba(249,115,22,0.12)] text-fly-orange`;
};
