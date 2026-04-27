import { ChevronLeft, ChevronRight } from "lucide-react";

type PlatformPaginationProps = {
  summary: string;
  page?: number;
  totalPages?: number;
};

export function PlatformPagination({ summary, page = 1, totalPages = 3 }: PlatformPaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
      <p className="m-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#333]">{summary}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/5 bg-[#0d0d0d] text-[#333] hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`grid h-9 min-w-[36px] place-items-center rounded-xl px-2 text-[0.65rem] font-black transition-all ${
              p === page
                ? "bg-white text-black"
                : "text-[#333] hover:text-[#666]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/5 bg-[#0d0d0d] text-[#333] hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
