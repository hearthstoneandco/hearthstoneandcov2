"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isInvitedEmail } from "@/lib/invites";

const candidates = [
  { name: "Sarah M.", role: "RN", facility: "Green Oaks Rehab", score: 96, status: "Ready to offer" },
  { name: "James T.", role: "LVN", facility: "Copperfield Healthcare & Rehab", score: 91, status: "In pool" },
  { name: "Alyssa R.", role: "CNA", facility: "Belmont Village", score: 89, status: "Offered" },
];

const approvals = [
  { clinician: "Sarah M.", facility: "Green Oaks Rehab", hours: "12.0", rate: "$58/hr", state: "Pending approval" },
  { clinician: "James T.", facility: "Copperfield Healthcare & Rehab", hours: "8.0", rate: "$46/hr", state: "Disputed" },
];

export default function AdminPortalPage() {
  const [selected, setSelected] = useState(candidates[0]);
  const [email, setEmail] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email ?? null;
      setEmail(sessionEmail);
      void (async () => setAllowed(await isInvitedEmail(sessionEmail)))();
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setEmail(null);
    setAllowed(false);
  };

  if (email && !allowed) {
    return (
      <main className="pt-[72px]">
        <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
          <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Access denied
            </h1>
            <p className="mt-3 text-slate-700">
              This Google account is not on the admin invite list.
            </p>
            <button onClick={handleSignOut} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
              Sign out
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Hearthstone admin portal</p>
              <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                Match shifts, approve hours, and move payroll forward.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Everything is organized around compliance, speed, and accountability.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/85">
              <div className="font-semibold text-[#c9a84c]">Signed in</div>
              <div className="mt-1">{email ?? "Awaiting Google sign-in"}</div>
              <button onClick={handleSignOut} className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 xl:grid-cols-4 lg:px-8">
          {[
            ["Open shifts", "14"],
            ["Active matches", "9"],
            ["Pending approvals", "6"],
            ["Payroll ready", "$18,420"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#0f3d2a]/10 bg-[#f9f5ee] p-5">
              <div className="text-2xl font-semibold text-[#0f3d2a]">{value}</div>
              <div className="mt-1 text-sm text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f9f5ee]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Matching queue</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Rank, offer, and release to pool.
            </h2>
            <div className="mt-6 space-y-4">
              {candidates.map((candidate) => (
                <button
                  key={candidate.name}
                  onClick={() => setSelected(candidate)}
                  className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                    selected.name === candidate.name ? "border-[#0f3d2a] bg-[#0f3d2a]/5" : "border-[#0f3d2a]/10 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-[#0f3d2a]">{candidate.name}</div>
                      <div className="text-sm text-slate-600">{candidate.role} · {candidate.facility}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#0f3d2a]">{candidate.score}% match</div>
                  </div>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d6419]">{candidate.status}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Selected candidate</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                {selected.name}
              </h3>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p><strong>Role:</strong> {selected.role}</p>
                <p><strong>Facility:</strong> {selected.facility}</p>
                <p><strong>Match score:</strong> {selected.score}%</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button className="rounded-full bg-[#0f3d2a] px-5 py-3 text-sm font-semibold text-white">Send offer</button>
                <button className="rounded-full border border-[#0f3d2a]/15 px-5 py-3 text-sm font-semibold text-[#0f3d2a]">Release to pool</button>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#0f3d2a] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">Notifications</p>
              <div className="mt-3 space-y-2 text-sm text-white/80">
                <p>• SMS sent to top 3 qualified clinicians</p>
                <p>• Acceptance reminder at 1 hour</p>
                <p>• Auto-decline at 2 hours</p>
                <p>• Shift pool alert if no response</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Approval queue</p>
              <div className="mt-4 space-y-4">
                {approvals.map((item) => (
                  <div key={`${item.clinician}-${item.facility}`} className="rounded-2xl border border-[#0f3d2a]/10 bg-[#f9f5ee] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[#0f3d2a]">{item.clinician}</div>
                        <div className="text-sm text-slate-600">{item.facility}</div>
                      </div>
                      <div className="text-right text-sm text-slate-700">
                        <div>{item.hours} hours</div>
                        <div>{item.rate}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d6419]">{item.state}</span>
                      <div className="flex gap-2">
                        <button className="rounded-full bg-[#0f3d2a] px-4 py-2 text-xs font-semibold text-white">Approve</button>
                        <button className="rounded-full border border-[#0f3d2a]/15 px-4 py-2 text-xs font-semibold text-[#0f3d2a]">Dispute</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
