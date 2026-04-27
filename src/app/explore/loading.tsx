import { LoadingScreen } from "@/components/motion/LoadingScreen";

export default function ExploreLoading() {
  return (
    <div className="min-h-dvh bg-[#0a0a0a]">
      <div className="h-16 animate-pulse border-b border-[#1f1f1f] bg-[#0a0a0a]" />
      <LoadingScreen variant="default" />
    </div>
  );
}
