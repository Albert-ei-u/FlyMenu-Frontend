"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  ShieldCheck,
  UserSearch,
  X,
} from "lucide-react";
import { Reveal } from "@/components/motion";
import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";
import { api } from "@/lib/api";

interface ApplicationDetail {
  id: string;
  restaurantName: string;
  category: string;
  description: string;
  status: string;
  submittedAt: string;
  applicantName: string;
  applicantEmail: string;
  documents: {
    id: string;
    label: string;
    fileUrl: string;
  }[];
}

export default function ApprovalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchDetail = async () => {
    try {
      const data = await api.get(`/restaurant-applications/${id}`);
      setDetail(data);
    } catch (err) {
      console.error("Failed to fetch application detail:", err);
      router.push("/platform/approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id, router]);

  const handleReview = async (decision: "approve" | "reject") => {
    setProcessing(true);
    try {
      await api.post(`/restaurant-applications/${id}/${decision}`, {
        reviewNotes,
      });
      router.push("/platform/approvals");
    } catch (err) {
      console.error(`Failed to ${decision} application:`, err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminShell active="Pending Approvals">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  if (!detail) return null;

  const getFullUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:4000";
    return `${baseUrl}${url}`;
  };

  return (
    <SuperAdminShell active="Pending Approvals">
      <div>
        <Reveal blur>
          <div className="mb-10">
            <nav className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#333]">
              <span>Platform</span>
              <ChevronRight className="h-3 w-3" />
              <span>Verification</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-fly-orange">
                {detail.id.slice(0, 8)}...
              </span>
            </nav>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white uppercase italic">
              Restaurant Asset Review
            </h1>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <Reveal delay={80}>
              <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-10 shadow-2xl">
                <div className="flex items-center gap-8 mb-12 pb-12 border-b border-white/5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#141414] text-3xl font-black text-[#444] ring-1 ring-white/5">
                    {detail.restaurantName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="m-0 text-3xl font-black text-white uppercase italic tracking-tighter">
                      {detail.restaurantName}
                    </h2>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="rounded-lg bg-[#141414] px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-[#666] ring-1 ring-white/5">
                        {detail.category}
                      </span>
                      <span className="rounded-lg bg-fly-orange/10 px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-fly-orange ring-1 ring-inset ring-fly-orange/20">
                        {detail.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <section className="mb-12">
                  <h3 className="m-0 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#444] mb-6">
                    Overview
                  </h3>
                  <p className="m-0 text-[0.9rem] font-bold leading-relaxed text-[#999]">
                    {detail.description ||
                      "No description provided by the restaurant asset owner."}
                  </p>
                </section>

                <section>
                  <h3 className="m-0 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#444] mb-6">
                    Legal Documentation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detail.documents.length === 0 ? (
                      <p className="text-[0.75rem] font-bold text-[#333]">
                        No documentation assets available.
                      </p>
                    ) : (
                      detail.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-[#141414] px-6 py-4 group hover:border-fly-orange/30 transition-all"
                        >
                          <span className="inline-flex items-center gap-3 text-[0.75rem] font-black text-[#999] group-hover:text-white transition-colors">
                            <FileText className="h-4 w-4 text-fly-orange" />
                            {doc.label}
                          </span>
                          <a
                            href={getFullUrl(doc.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#444] hover:text-white transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </article>
            </Reveal>
          </div>

          <aside className="space-y-8">
            <Reveal direction="left" delay={120}>
              <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-8 shadow-2xl">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="m-0 text-[0.85rem] font-black uppercase tracking-[0.2em] text-white">
                    Action Panel
                  </h2>
                  <ShieldCheck className="h-5 w-5 text-fly-orange" />
                </div>

                <div className="space-y-6">
                  <label className="block">
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-[#444]">
                      Internal Notes
                    </span>
                    <textarea
                      className="mt-3 min-h-[120px] w-full resize-none rounded-xl border border-white/5 bg-[#141414] p-4 text-[0.8rem] font-bold text-white outline-none transition-all placeholder:text-[#333] focus:border-fly-orange/30"
                      placeholder="Add review notes..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </label>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleReview("approve")}
                      disabled={processing || detail.status !== "NEW"}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 text-[0.7rem] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      {processing ? "Processing..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview("reject")}
                      disabled={processing || detail.status !== "NEW"}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#141414] py-4 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#666] transition-all hover:bg-red-900/20 hover:text-red-500 hover:border-red-900/50 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      {processing ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-[0.7rem] font-black text-[#444]">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    System Verified
                  </div>
                  <div className="flex items-center gap-3 text-[0.7rem] font-black text-[#444]">
                    <UserSearch className="h-4 w-4 text-emerald-500" />
                    Identity Clear
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal direction="left" delay={200}>
              <article className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-8">
                <h3 className="m-0 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#444] mb-6">
                  Applicant Info
                </h3>
                <div className="space-y-6">
                  <div>
                    <span className="block text-[0.6rem] font-black uppercase tracking-widest text-[#333] mb-1">
                      Entity Head
                    </span>
                    <strong className="text-[0.85rem] font-black text-white">
                      {detail.applicantName}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[0.6rem] font-black uppercase tracking-widest text-[#333] mb-1">
                      Communication
                    </span>
                    <strong className="text-[0.85rem] font-black text-white">
                      {detail.applicantEmail}
                    </strong>
                  </div>
                </div>
              </article>
            </Reveal>

            <Link
              href="/platform/approvals"
              className="flex items-center justify-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#444] no-underline hover:text-white transition-colors"
            >
              Back to queue
            </Link>
          </aside>
        </div>

        <PlatformFooter />
      </div>
    </SuperAdminShell>
  );
}
