import { Skeleton, SkeletonCard, SkeletonTableRows } from "./Skeleton";

type LoadingScreenProps = {
  variant?: "default" | "dashboard" | "table" | "auth";
};

export function LoadingScreen({ variant = "default" }: LoadingScreenProps) {
  if (variant === "auth") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0d0d0d] p-6">
        <div className="w-full max-w-md space-y-4 rounded-[32px] border border-[#2a2a2a] bg-[#1a1a1a] p-8">
          <Skeleton className="mx-auto h-12 w-12" rounded="full" />
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="h-12 w-full" rounded="full" />
          <Skeleton className="h-12 w-full" rounded="full" />
          <Skeleton className="h-12 w-full" rounded="full" />
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="animate-fade-in px-6 py-8 motion-reduce:animate-none">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-5 w-96 max-w-full" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-9 w-20" />
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" rounded="xl" />
          <Skeleton className="h-64 w-full" rounded="xl" />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="animate-fade-in px-6 py-8 motion-reduce:animate-none">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="mt-2 h-5 w-80 max-w-full" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-3 h-9 w-24" />
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <Skeleton className="mb-4 h-6 w-40" />
          <SkeletonTableRows rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-6 py-8 motion-reduce:animate-none">
      <Skeleton className="h-12 w-72 max-w-full" />
      <Skeleton className="mt-4 h-6 w-full max-w-lg" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
