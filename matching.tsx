"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackCandidates = [
  { id: "fallback-1", name: "Sarah M.", role: "RN", score: 96, distance: "8.4 mi", status: "Ready to offer" },
  { id: "fallback-2", name: "James T.", role: "LVN", score: 91, distance: "14.2 mi", status: "In pool" },
  { id: "fallback-3", name: "Alyssa R.", role: "CNA", score: 89, distance: "6.1 mi", status: "Offered" },
];

export default function MatchingPage() {
  const [selected, setSelected] = useState(fallbackCandidates[0]);
  const [saved, setSaved] = useState(false);
  const [candidates, setCandidates] = useState(fallbackCandidates);
  const [shifts, setShifts] = useState<{ id: string; label: string }[]>([]);
  const [selectedShift, setSelectedShift] = useState("");

  useEffect(() => {
    supabase.from("clinicians").select("id, license_type, preferred_radius_miles, is_available").then(({ data }) => {
      if (data?.length) {
        const nextCandidates = data.map((item: any, index: number) => ({
          id: item.id ?? `clinician-${index}`,
          name: item.id,
          role: item.license_type,
          score: 90,
          distance: `${item.preferred_radius_miles ?? 25} mi`,
          status: item.is_available ? "Ready to offer" : "In pool",
        }));

        setCandidates(nextCandidates);
        setSelected(nextCandidates[0]);
      }
    });

    supabase.from("shifts").select("id, facility_id, position_type, shift_date, start_time, end_time").then(({ data }) => {
      if (data?.length) {
        const nextShifts = data.map((item: any, index: number) => ({
          id: item.id ?? `shift-${index}`,
          label: `${item.facility_id ?? "Facility"} • ${item.position_type ?? "Role"} • ${item.shift_date ?? "Date"} ${item.start_time ?? ""}-${item.end_time ?? ""}`,
        }));

        setShifts(nextShifts);
        setSelectedShift(nextShifts[0].id);
      }
    });
  }, []);

  const handleSendOffer = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId || !selectedShift) return;

    await supabase.from("shift_matches").insert({
      shift_id: selectedShift,
      clinician_id: selected.id,
      offered_by: userId,
      match_status: "offered",
      ranking_score: selected.score,
      offer_rank: 1,
      acceptance_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    });

    setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Matching</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Rank, offer, and track shift matches.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep the top clinicians in front of every shift and move quickly when one accepts.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Match queue
              </h2>
              <div className="mt-6 space-y-4">
                {candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => setSelected(candidate)}
                    className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                      selected.id === candidate.id ? "border-[#0f3d2a] bg-[#0f3d2a]/5" : "border-[#0f3d2a]/10 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-lg font-semibold text-[#0f3d2a]">{candidate.name}</div>
                        <div className="text-sm text-slate-600">{candidate.role}</div>
                      </div>
                      <div className="text-sm font-semibold text-[#0f3d2a]">{candidate.score}% match</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{candidate.distance} away</div>
                    <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d6419]">{candidate.status}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Selected clinician</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {selected.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p><strong>Role:</strong> {selected.role}</p>
                  <p><strong>Match score:</strong> {selected.score}%</p>
                  <p><strong>Distance:</strong> {selected.distance}</p>
                  <p><strong>Clinician ID:</strong> {selected.id}</p>
                </div>
                <div className="mt-6">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#0f3d2a]">Shift</label>
                  <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} className="w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none">
                    {shifts.length === 0 && <option value="">No shifts available</option>}
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button onClick={handleSendOffer} className="rounded-full bg-[#0f3d2a] px-5 py-3 text-sm font-semibold text-white">
                    Send offer
                  </button>
                  <button className="rounded-full border border-[#0f3d2a]/15 px-5 py-3 text-sm font-semibold text-[#0f3d2a]">
                    Release to pool
                  </button>
                </div>
                {saved && <div className="mt-4 text-sm font-semibold text-[#0f3d2a]">Offer sent.</div>}
              </div>

              <div className="rounded-[28px] bg-[#0f3d2a] p-6 text-white shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">Rules</p>
                <div className="mt-3 space-y-2 text-sm text-white/80">
                  <p>• Top 3 clinicians get texted at once</p>
                  <p>• 2 hour acceptance window</p>
                  <p>• 1 hour reminder before expiry</p>
                  <p>• Auto-decline if not accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
