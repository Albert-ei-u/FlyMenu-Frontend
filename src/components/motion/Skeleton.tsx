type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "xl";
};

const radius = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({ className = "", rounded = "lg" }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] ${radius[rounded]} ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
      <Skeleton className="h-40 w-full" rounded="lg" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-4 h-10 w-full" rounded="lg" />
    </div>
  );
}

export function SkeletonTableRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-[#2a2a2a] pb-3">
          <Skeleton className="h-10 w-10 shrink-0" rounded="md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-16" rounded="full" />
        </div>
      ))}
    </div>
  );
}
