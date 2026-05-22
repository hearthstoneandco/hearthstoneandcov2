"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackApprovals = [
  { id: "fallback-1", clinician: "Sarah M.", facility: "Green Oaks Rehab", hours: "12.0", rate: "$58/hr", status: "Pending" },
  { id: "fallback-2", clinician: "James T.", facility: "Copperfield Healthcare", hours: "8.0", rate: "$46/hr", status: "Disputed" },
  { id: "fallback-3", clinician: "Alyssa R.", facility: "Belmont Village", hours: "10.0", rate: "$28/hr", status: "Auto-approved" },
];

export default function ApprovalsPage() {
  const [saved, setSaved] = useState(false);
  const [approvals, setApprovals] = useState(fallbackApprovals);

  useEffect(() => {
    supabase.from("approvals").select("*").then(({ data }) => {
      if (data?.length) {
        setApprovals(
          data.map((item: any, index: number) => ({
            id: item.id ?? `approval-${index}`,
            clinician: item.clinician_id ?? "Clinician",
            facility: item.facility_id ?? "Facility",
            hours: String(item.hours_approved ?? "0.0"),
            rate: `$${item.rate_applied ?? 0}/hr`,
            status: item.approval_status ?? "Pending",
          }))
        );
      }
    });
  }, []);

  const handleApprove = async (approvalId: string) => {
    await supabase.from("approvals").update({ approval_status: "approved" }).eq("id", approvalId);
    setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Approvals</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Approve hours before payroll.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Facilities can approve or dispute hours. Hours stay locked once approved.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="space-y-4">
            {approvals.map((item) => (
              <div key={item.id} className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-[#0f3d2a]">{item.clinician}</div>
                    <div className="text-sm text-slate-600">{item.facility}</div>
                  </div>
                  <div className="grid gap-1 text-sm text-slate-700 md:text-right">
                    <div><strong>Hours:</strong> {item.hours}</div>
                    <div><strong>Rate:</strong> {item.rate}</div>
                    <div><strong>Status:</strong> {item.status}</div>
                    <div><strong>Approval ID:</strong> {item.id}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => handleApprove(item.id)} className="rounded-full bg-[#0f3d2a] px-5 py-3 text-sm font-semibold text-white">
                    Approve
                  </button>
                  <button className="rounded-full border border-[#0f3d2a]/15 px-5 py-3 text-sm font-semibold text-[#0f3d2a]">
                    Dispute
                  </button>
                </div>
              </div>
            ))}
            {saved && <div className="rounded-2xl bg-[#f9f5ee] p-4 text-sm font-semibold text-[#0f3d2a]">Approval saved.</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
