"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackShifts = [
  { id: "fallback-1", facility: "Green Oaks Rehab", role: "RN", date: "Fri, May 23", time: "7:00 AM - 7:00 PM", rate: "$58/hr", status: "Open" },
  { id: "fallback-2", facility: "Copperfield Healthcare", role: "LVN", date: "Sat, May 24", time: "3:00 PM - 11:00 PM", rate: "$46/hr", status: "Open" },
  { id: "fallback-3", facility: "Belmont Village", role: "CNA", date: "Sun, May 25", time: "7:00 AM - 7:00 PM", rate: "$28/hr", status: "Filled" },
];

export default function ShiftsPage() {
  const [saved, setSaved] = useState(false);
  const [facility, setFacility] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [rate, setRate] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [description, setDescription] = useState("");
  const [shifts, setShifts] = useState(fallbackShifts);

  useEffect(() => {
    supabase.from("shifts").select("id, facility_id, position_type, shift_date, start_time, end_time, rate_per_hour, status").then(({ data }) => {
      if (data?.length) {
        setShifts(
          data.map((item: any, index: number) => ({
            id: item.id ?? `shift-${index}`,
            facility: item.facility_id ?? "Facility",
            role: item.position_type ?? "Role",
            date: item.shift_date ?? "Date",
            time: `${item.start_time ?? ""} - ${item.end_time ?? ""}`.trim(),
            rate: item.rate_per_hour ? `$${item.rate_per_hour}/hr` : "$0/hr",
            status: item.status ?? "open",
          }))
        );
      }
    });
  }, []);

  const handleSave = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const { error } = await supabase.from("shifts").insert({
      created_by: userId,
      facility_id: facility,
      position_type: role,
      specialties_required: specialties ? specialties.split(",").map((item) => item.trim()) : [],
      shift_date: date,
      start_time: time.split("-")[0]?.trim(),
      end_time: time.split("-")[1]?.trim(),
      rate_per_hour: rate ? Number(rate.replace("$", "").replace("/hr", "")) : null,
      description,
      status: "open",
    });

    if (!error) setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Shifts</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Post, view, and manage live shifts.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep open roles organized and ready for matching.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Create shift
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input value={facility} onChange={(e) => setFacility(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Facility" />
                <input value={role} onChange={(e) => setRole(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Role" />
                <input value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Date" />
                <input value={time} onChange={(e) => setTime(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Time" />
                <input value={rate} onChange={(e) => setRate(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Rate" />
                <input value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Specialties required" />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-4 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" rows={4} placeholder="Description or special instructions" />
              <button onClick={handleSave} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                Save shift
              </button>
              {saved && <div className="mt-4 text-sm font-semibold text-[#0f3d2a]">Shift saved.</div>}
            </div>

            <div className="space-y-4">
              {shifts.map((shift: any) => (
                <div key={shift.id} className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#0f3d2a]">{shift.facility}</h3>
                    <span className="rounded-full bg-[#f9f5ee] px-3 py-1 text-xs font-semibold text-[#0f3d2a]">{shift.status}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <div><strong>Role:</strong> {shift.role}</div>
                    <div><strong>Date:</strong> {shift.date}</div>
                    <div><strong>Time:</strong> {shift.time}</div>
                    <div><strong>Rate:</strong> {shift.rate}</div>
                    <div><strong>Shift ID:</strong> {shift.id}</div>
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
