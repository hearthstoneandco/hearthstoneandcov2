"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClinicianProfilePage() {
  const [saved, setSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [radius, setRadius] = useState("30");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;

      const [{ data: profile }, { data: clinician }] = await Promise.all([
        supabase.from("user_profiles").select("first_name, last_name, phone").eq("id", userId).maybeSingle(),
        supabase.from("clinicians").select("license_type, license_number, preferred_radius_miles, availability_notes").eq("id", userId).maybeSingle(),
      ]);

      if (profile) {
        setFirstName(profile.first_name ?? "");
        setLastName(profile.last_name ?? "");
        setPhone(profile.phone ?? "");
      }

      if (clinician) {
        setLicenseType(clinician.license_type ?? "");
        setLicenseNumber(clinician.license_number ?? "");
        setRadius(String(clinician.preferred_radius_miles ?? 30));
        setNotes(clinician.availability_notes ?? "");
      }
    });
  }, []);

  const handleSave = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    await supabase.from("user_profiles").upsert({
      id: userId,
      user_type: "clinician",
      first_name: firstName,
      last_name: lastName,
      phone,
    });

    const { error } = await supabase.from("clinicians").upsert({
      id: userId,
      license_type: licenseType,
      license_number: licenseNumber,
      preferred_radius_miles: Number(radius),
      availability_notes: notes,
    });

    if (!error) setSaved(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Clinician profile</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Complete your profile before you start accepting shifts.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Add your license details, contact info, and preferences so matching stays fast and accurate.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Profile details
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="First name" />
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Last name" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Phone" />
                <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="License number" />
                <input value={licenseType} onChange={(e) => setLicenseType(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="License type" />
                <input value={radius} onChange={(e) => setRadius(e.target.value)} className="rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Preferred radius (miles)" />
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-4 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" rows={4} placeholder="Availability notes, specialties, and preferences" />
              <button onClick={handleSave} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                Save profile
              </button>
            </div>

            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#0f3d2a]">What this unlocks</h3>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li>• Matching to the right shifts</li>
                <li>• Radius-based offers</li>
                <li>• Credential tracking</li>
                <li>• Shift acceptance and clock in/out</li>
                <li>• Hours and approvals</li>
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
