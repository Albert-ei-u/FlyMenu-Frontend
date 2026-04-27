"use client";

import {
  Calendar,
  ChevronDown,
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Reveal, Stagger } from "@/components/motion";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  adminPageTitleH1,
  adminPageTitleP,
  primaryAction,
  secondaryAction,
  settingsField,
  settingsLabel,
} from "@/components/admin/admin-ui";

export default function NewClientPage() {
  const router = useRouter();

  return (
    <AdminShell active="Clients">
      <div className={`${adminContent} relative`}>
        {/* Background Overlay to dim the list view below */}
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => router.push("/admin/clients")} />

        <div className="relative z-50 flex justify-center py-10">
          <Reveal blur direction="up">
            <form 
              className={`${adminCard} w-full max-w-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]`}
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/admin/clients");
              }}
            >
              <header className="flex items-center justify-between border-b border-[#262626] bg-[#1c1c1c] px-8 py-6">
                <div>
                  <h1 className="text-2xl font-black text-white">Register New Client</h1>
                  <p className="text-sm text-[#888888] mt-1">Onboard a new guest into the loyalty ecosystem.</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/admin/clients")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-[#666666] transition hover:bg-[#333333] hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </header>

              <div className="p-8 space-y-8">
                <section>
                  <h2 className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-fly-orange mb-4">
                    Personal Information
                  </h2>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className={settingsLabel}>Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                        <input 
                          className={`${settingsField} pl-10`} 
                          placeholder="e.g. Alexander Sterling" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className={settingsLabel}>Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                          <input 
                            type="email"
                            className={`${settingsField} pl-10`} 
                            placeholder="alex.sterling@example.com" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={settingsLabel}>Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                          <input 
                            type="tel"
                            className={`${settingsField} pl-10`} 
                            placeholder="+1 (555) 012-3456" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-fly-orange mb-4">
                    Loyalty & Membership
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className={settingsLabel}>Membership Tier</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                        <select className={`${settingsField} pl-10 appearance-none`} defaultValue="Standard">
                          <option value="Standard">Standard Tier</option>
                          <option value="Gold">Gold Tier</option>
                          <option value="Platinum">Platinum Elite</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={settingsLabel}>Birth Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                        <input 
                          type="date"
                          className={`${settingsField} pl-10`} 
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <label className={settingsLabel}>Preferences & Internal Notes</label>
                  <textarea 
                    className={`${settingsField} mt-2 min-h-[100px] resize-none py-3`}
                    placeholder="e.g. Prefers window seats, allergic to peanuts, frequently orders red wine..."
                  />
                </section>
              </div>

              <footer className="flex items-center justify-end gap-4 border-t border-[#262626] bg-[#1c1c1c] px-8 py-6">
                <button
                  type="button"
                  onClick={() => router.push("/admin/clients")}
                  className={secondaryAction}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className={primaryAction}
                >
                  Create Client Profile
                </button>
              </footer>
            </form>
          </Reveal>
        </div>
      </div>
    </AdminShell>
  );
}



