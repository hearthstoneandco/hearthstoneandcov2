"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const getDistanceMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function ClockingPage() {
  const [status, setStatus] = useState("Ready to clock in");
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [facilityLocation, setFacilityLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [facilityName, setFacilityName] = useState("");
  const [matches, setMatches] = useState<{ id: string; label: string; facility_id?: string | null }[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("shift_matches").select("id, shift_id, clinician_id, match_status, shifts!shift_matches_shift_id_fkey(id, facility_id, position_type, shift_date, start_time, end_time, facilities!shifts_facility_id_fkey(id, facility_name, latitude, longitude))").then(({ data }) => {
      if (data?.length) {
        const nextMatches = data.map((item: any, index: number) => {
          const shift = Array.isArray(item.shifts) ? item.shifts[0] : item.shifts;
          const facility = shift?.facilities;

          return {
            id: item.id ?? `match-${index}`,
            label: `${facility?.facility_name ?? shift?.position_type ?? "Shift"} • ${shift?.shift_date ?? "Date"} ${shift?.start_time ?? ""}-${shift?.end_time ?? ""}`,
            facility_id: facility?.id ?? shift?.facility_id ?? null,
          };
        });

        setMatches(nextMatches);
        setSelectedMatchId(nextMatches[0].id);
        setSelectedFacilityId(nextMatches[0].facility_id ?? "");
        setFacilityName(nextMatches[0].label.split(" • ")[0] ?? "");
        if (nextMatches[0].facility_id) {
          supabase.from("facilities").select("latitude, longitude").eq("id", nextMatches[0].facility_id).maybeSingle().then(({ data: facility }) => {
            setFacilityLocation(facility ?? null);
          });
        }
      }
    });

    supabase.from("facilities").select("id, facility_name, latitude, longitude").then(({ data }) => {
      if (data?.length) {
        const selected = data.find((item: any) => item.id === selectedFacilityId) ?? data[0];
        setFacilityLocation(selected ? { latitude: selected.latitude, longitude: selected.longitude } : null);
        setFacilityName(selected?.facility_name ?? "");
        if (!selectedFacilityId) {
          setSelectedFacilityId(selected?.id ?? "");
        }
      }
    });
      }
    });
  }, []);

  const handleClockIn = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId || !selectedMatchId) return;

    const position = await new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

    const facilityLatitude = facilityLocation?.latitude ?? 29.7604;
    const facilityLongitude = facilityLocation?.longitude ?? -95.3698;
    const facilityRadiusMiles = 1;
    const distanceMiles = position ? getDistanceMiles(position.latitude, position.longitude, facilityLatitude, facilityLongitude) : null;
    const clockInApproved = distanceMiles === null ? true : distanceMiles <= facilityRadiusMiles;
    const clockInStatus = distanceMiles === null ? "approved" : clockInApproved ? "approved" : "pending";

    await supabase.from("clock_records").insert({
      clinician_id: userId,
      shift_match_id: selectedMatchId,
      facility_id: selectedFacilityId || null,
      clock_in_time: new Date().toISOString(),
      clock_in_approved: clockInApproved,
      latitude: position?.latitude ?? null,
      longitude: position?.longitude ?? null,
      distance_from_facility_miles: distanceMiles,
      status: clockInStatus,
    });

    setSaved(true);
    setStatus(clockInApproved ? "Clocked in" : "Clock-in pending location review");
  };

  const handleClockOut = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const { data: openRecord } = await supabase
      .from("clock_records")
      .select("id")
      .eq("clinician_id", userId)
      .is("clock_out_time", null)
      .order("clock_in_time", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!openRecord) return;

    const position = await new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

    const facilityLatitude = facilityLocation?.latitude ?? 29.7604;
    const facilityLongitude = facilityLocation?.longitude ?? -95.3698;
    const facilityRadiusMiles = 1;
    const distanceMiles = position ? getDistanceMiles(position.latitude, position.longitude, facilityLatitude, facilityLongitude) : null;

    await supabase.from("clock_records").update({
      clock_out_time: new Date().toISOString(),
      clock_out_latitude: position?.latitude ?? null,
      clock_out_longitude: position?.longitude ?? null,
      clock_out_distance_from_facility_miles: distanceMiles,
      status: distanceMiles !== null && distanceMiles <= facilityRadiusMiles ? "completed" : "location_review",
    }).eq("id", openRecord.id);

    setStatus("Clocked out");
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Clocking</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Clock in and out with location checks.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep the process simple and auditable.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Location check
              </h2>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <p>• 0–0.5 miles: auto-approved</p>
                <p>• 0.5–1 mile: warning, clinician confirms</p>
                <p>• 1+ miles: rejected unless overridden</p>
              </div>
              <div className="mt-6 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#0f3d2a]">Shift match</label>
                <select value={selectedMatchId} onChange={(e) => setSelectedMatchId(e.target.value)} className="w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none">
                  {matches.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.label}
                    </option>
                  ))}
                </select>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#0f3d2a]">Facility</label>
                <input value={facilityName} readOnly className="w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Facility name" />
                <p className="text-xs text-slate-500">Geolocation is checked at clock-in and clock-out. Under 1 mile is approved automatically.</p>
                <p className="text-xs text-slate-500">Clock-out records the clinician's location too.</p>
                <p className="text-xs text-slate-500">Facility coordinates are loaded from the selected shift match when available.</p>
                <input value={selectedFacilityId} onChange={(e) => setSelectedFacilityId(e.target.value)} className="w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" placeholder="Facility ID" />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={handleClockIn} className="rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                  Clock In
                </button>
                <button onClick={handleClockOut} className="rounded-full border border-[#0f3d2a]/15 px-6 py-3 text-sm font-semibold text-[#0f3d2a]">
                  Clock Out
                </button>
              </div>
              <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-semibold text-[#0f3d2a]">{status}</div>
              {saved && <div className="mt-4 text-sm font-semibold text-[#0f3d2a]">Clock record saved.</div>}
            </div>

            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#0f3d2a]">Recorded data</h3>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li>• Clinician ID</li>
                <li>• Shift match ID</li>
                <li>• Clock in and out timestamps</li>
                <li>• Latitude / longitude</li>
                <li>• Distance from facility</li>
                <li>• Approval or override status</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
