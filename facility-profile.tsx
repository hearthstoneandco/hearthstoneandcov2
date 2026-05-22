"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FacilityProfilePage() {
  const [saved, setSaved] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [billRate, setBillRate] = useState("");
  const [timeoutHours, setTimeoutHours] = useState("48");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;

      const { data: facility } = await supabase
        .from("facilities")
        .select("facility_name, facility_type, address, city, state, zip, contact_person_name, contact_person_email, bill_rate, approval_auto_timeout_hours, special_instructions")
        .eq("facility_admin_id", userId)
        .maybeSingle();

      if (facility) {
        setFacilityName(facility.facility_name ?? "");
        setFacilityType(facility.facility_type ?? "");
        setAddress(facility.address ?? "");
        setCity(facility.city ?? "");
        setState(facility.state ?? "");
        setZip(facility.zip ?? "");
        setContactPerson(facility.contact_person_name ?? "");
        setContactEmail(facility.contact_person_email ?? "");
        setBillRate(facility.bill_rate ? String(facility.bill_rate) : "");
        setTimeoutHours(String(facility.approval_auto_timeout_hours ?? 48));
        setNotes(facility.special_instructions ?? "");
      }
    });
  }, []);

  const handleSave = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const { error } = await supabase.from("facilities").upsert({
      facility_admin_id: userId,
      facility_name: facilityName,
      facility_type: facilityType,
      address,
      city,
      state,
      zip,
      contact_person_name: contactPerson,
      contact_person_email: contactEmail,
      bill_rate: billRate ? Number(billRate) : null,
      approval_auto_timeout_hours: Number(timeoutHours),
      special_instructions: notes,
    });

    if (!error) setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Facility profile</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Set up your facility details and approval rules.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep the workflow clean. Confirm the right contact info, billing rate, and approval timing.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Facility details
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input value={facilityName} onChange={(e) => setFacilityName(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Facility name" />
                <input value={facilityType} onChange={(e) => setFacilityType(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Facility type" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Address" />
                <input value={city} onChange={(e) => setCity(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="City" />
                <input value={state} onChange={(e) => setState(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="State" />
                <input value={zip} onChange={(e) => setZip(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Zip" />
                <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Contact person" />
                <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Contact email" />
                <input value={billRate} onChange={(e) => setBillRate(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Bill rate" />
                <input value={timeoutHours} onChange={(e) => setTimeoutHours(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Approval timeout (hours)" />
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-4 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" rows={4} placeholder="Special instructions or notes" />
              <button onClick={handleSave} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                Save profile
              </button>
            </div>

            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#0f3d2a]">What this controls</h3>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li>• Facility profile shown to admins</li>
                <li>• Default approval timeout</li>
                <li>• Rate and billing details</li>
                <li>• Clock-in / clock-out validation</li>
                <li>• Shift posting context</li>
              </ul>
              {saved && (
                <div className="mt-6 rounded-2xl bg-[#f9f5ee] p-4 text-sm font-semibold text-[#0f3d2a]">
                  Profile saved.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
