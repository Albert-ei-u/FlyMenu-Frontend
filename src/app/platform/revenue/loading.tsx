import { LoadingScreen } from "@/components/motion/LoadingScreen";

export default function RevenueLoading() {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] pl-0 lg:pl-[280px]">
      <LoadingScreen variant="dashboard" />
    </div>
  );
}
