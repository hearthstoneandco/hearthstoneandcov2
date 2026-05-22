"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackRatings = [
  { id: "fallback-1", clinician: "Sarah M.", facility: "Green Oaks Rehab", stars: 5, reliability: 5, punctuality: 5 },
  { id: "fallback-2", clinician: "James T.", facility: "Copperfield Healthcare", stars: 4, reliability: 4, punctuality: 5 },
  { id: "fallback-3", clinician: "Alyssa R.", facility: "Belmont Village", stars: 5, reliability: 5, punctuality: 5 },
];

export default function RatingsPage() {
  const [saved, setSaved] = useState(false);
  const [ratings, setRatings] = useState(fallbackRatings);

  useEffect(() => {
    supabase.from("facility_ratings").select("*").then(({ data }) => {
      if (data?.length) {
        setRatings(
          data.map((item: any, index: number) => ({
            id: item.id ?? `rating-${index}`,
            clinician: item.clinician_id ?? "Clinician",
            facility: item.facility_id ?? "Facility",
            stars: item.overall_rating ?? 0,
            reliability: item.reliability_rating ?? 0,
            punctuality: item.punctuality_rating ?? 0,
          }))
        );
      }
    });
  }, []);

  const handleSave = async () => {
    await supabase.from("facility_ratings").insert({
      clinician_id: "",
      facility_id: "",
      overall_rating: 5,
      reliability_rating: 5,
      punctuality_rating: 5,
      comments: "",
    });
    setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Facility ratings</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Rate clinicians after each shift.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep performance feedback private and useful for future matching.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                New rating
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Clinician" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Facility" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Stars" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Would request again" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Professionalism" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Punctuality" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Clinical skills" />
                <input className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Reliability" />
              </div>
              <textarea className="mt-4 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" rows={4} placeholder="Comments" />
              <button onClick={handleSave} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                Save rating
              </button>
              {saved && <div className="mt-4 text-sm font-semibold text-[#0f3d2a]">Rating saved.</div>}
            </div>

            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={`${rating.clinician}-${rating.facility}`} className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#0f3d2a]">{rating.clinician}</h3>
                    <span className="rounded-full bg-[#f9f5ee] px-3 py-1 text-xs font-semibold text-[#0f3d2a]">{rating.stars} stars</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <div><strong>Facility:</strong> {rating.facility}</div>
                    <div><strong>Punctuality:</strong> {rating.punctuality}</div>
                    <div><strong>Reliability:</strong> {rating.reliability}</div>
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
