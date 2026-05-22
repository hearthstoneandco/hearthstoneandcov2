"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackBatches = [
  { id: "fallback-1", date: "Fri, May 23", clinicians: 12, hours: 124.5, total: "$18,420", status: "Ready for ADP" },
  { id: "fallback-2", date: "Fri, May 16", clinicians: 9, hours: 88.0, total: "$12,670", status: "Sent to ADP" },
  { id: "fallback-3", date: "Fri, May 9", clinicians: 11, hours: 103.0, total: "$15,210", status: "Processed" },
];

export default function PayrollPage() {
  const [saved, setSaved] = useState(false);
  const [batches, setBatches] = useState(fallbackBatches);

  useEffect(() => {
    supabase.from("payroll_batches").select("*").then(({ data }) => {
      if (data?.length) {
        setBatches(
          data.map((item: any, index: number) => ({
            id: item.id ?? `batch-${index}`,
            date: item.batch_date ?? "Batch",
            clinicians: item.clinicians_count ?? 0,
            hours: item.total_hours ?? 0,
            total: `$${item.total_gross_pay ?? 0}`,
            status: item.status ?? "Ready for ADP",
          }))
        );
      }
    });
  }, []);

  const handleSaveBatch = async () => {
    await supabase.from("payroll_batches").insert({
      batch_date: new Date().toISOString().slice(0, 10),
      status: "ready_for_adp",
      total_hours: 0,
      total_gross_pay: 0,
      clinicians_count: 0,
      approval_ids: [],
    });
    setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Payroll</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Roll approved hours into payroll batches.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep the ADP handoff clean and tracked.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Create batch
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Batch date" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Total clinicians" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Total hours" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Total payroll" />
              </div>
              <textarea className="mt-4 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" rows={4} placeholder="Approval IDs or notes" />
              <div className="mt-6 flex gap-3">
                <button onClick={handleSaveBatch} className="rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                  Save batch
                </button>
                <button className="rounded-full border border-[#0f3d2a]/15 px-6 py-3 text-sm font-semibold text-[#0f3d2a]">
                  Send to ADP
                </button>
              </div>
              {saved && <div className="mt-4 text-sm font-semibold text-[#0f3d2a]">Batch saved.</div>}
            </div>

            <div className="space-y-4">
              {batches.map((batch) => (
                <div key={batch.id} className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#0f3d2a]">{batch.date}</h3>
                    <span className="rounded-full bg-[#f9f5ee] px-3 py-1 text-xs font-semibold text-[#0f3d2a]">{batch.status}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <div><strong>Clinicians:</strong> {batch.clinicians}</div>
                    <div><strong>Hours:</strong> {batch.hours}</div>
                    <div><strong>Total:</strong> {batch.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
