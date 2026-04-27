"use client";

import { useEffect, useState } from "react";
import { Download, Filter } from "lucide-react";
import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { SuperAdminShell } from "@/components/platform/SuperAdminShell";

interface ActivityLog {
  id: string;
  action: string;
  metadata: any;
  createdAt: string;
}

export default function PlatformActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:4000/api/v1/platform/activity",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          setActivities(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch activity logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <SuperAdminShell active="System Activity" topTab="Analytics">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell active="System Activity" topTab="Analytics">
      <div className="px-6 py-6 max-lg:px-4">
        <h1 className="m-0 text-2xl font-black text-white">
          Analytics & Activity
        </h1>
        <p className="mt-2 text-[#9a9a9a]">
          Platform audit trail and live system events.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
            <h2 className="m-0 font-bold text-white">Live feed</h2>
            <ul className="mt-5 space-y-5 p-0" style={{ listStyle: "none" }}>
              {activities.slice(0, 10).map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-fly-orange" />
                  <div>
                    <p className="m-0 text-sm text-[#d4d4d4]">
                      {item.action.replace(/_/g, " ")}
                    </p>
                    <span className="mt-1 block text-[0.65rem] font-bold uppercase text-[#666666]">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] p-5">
              <h2 className="m-0 font-bold text-white">Audit log</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs font-bold text-[#a7a7a7]"
                >
                  <Filter className="mr-1 inline h-3 w-3" />
                  Filter
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-fly-orange px-3 py-1.5 text-xs font-bold text-white"
                >
                  <Download className="mr-1 inline h-3 w-3" />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {activities.map((entry) => (
                    <tr key={entry.id} className="border-t border-[#2a2a2a]">
                      <td className="px-5 py-3 font-semibold text-white">
                        System
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-[#888888]">
                        {entry.action}
                      </td>
                      <td className="px-5 py-3 text-[#666666]">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <PlatformFooter />
      </div>
    </SuperAdminShell>
  );
}
