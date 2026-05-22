"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isInvitedEmail } from "@/lib/invites";

const shifts = [
  { facility: "Green Oaks Rehab", role: "RN", time: "7:00 AM - 7:00 PM", rate: "$52/hr", status: "Offered" },
  { facility: "Belmont Village", role: "CNA", time: "11:00 PM - 7:00 AM", rate: "$28/hr", status: "Accepted" },
  { facility: "Copperfield Healthcare", role: "LVN", time: "3:00 PM - 11:00 PM", rate: "$46/hr", status: "Pending" },
];

export default function ClinicianPortalPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [step, setStep] = useState<"review" | "portal">("review");
  const [accessDenied, setAccessDenied] = useState(false);
  const suggestedPrompt = useMemo(
    () =>
      "Thanks for working with Hearthstone & Co. If you were happy with the staffing support and communication, please leave a Google review. Your feedback helps us serve facilities better.",
    []
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email ?? null;
      setEmail(sessionEmail);
      void (async () => {
        const allowed = await isInvitedEmail(sessionEmail);
        setAccessDenied(Boolean(sessionEmail && !allowed));
        setSignedIn(Boolean(sessionEmail && allowed));
      })();
    });
  }, []);

  const handleGoogleSignIn = async () => {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://aiepbgmvckadxygddelh.supabase.co/auth/v1/callback" },
    });
    if (data.url) window.location.assign(data.url);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSignedIn(false);
    setEmail(null);
    setAccessDenied(false);
    setStep("review");
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Clinician Portal</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              Sign in with Google to view shifts, hours, and messages.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Invite-only access. No passwords. Your profile, assignments, and updates stay in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          {accessDenied ? (
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Access denied
              </h2>
              <p className="mt-3 text-slate-700">
                This Google account is not on the invite list for the clinician portal.
              </p>
              <button onClick={handleSignOut} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                Sign out
              </button>
            </div>
          ) : !signedIn ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Google sign-in
                </h2>
                <p className="mt-3 text-slate-700">This connects directly to your Supabase auth account.</p>
                <button type="button" onClick={handleGoogleSignIn} className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                  Sign in with Google
                </button>
                <p className="mt-4 text-sm text-slate-600">Invite-only access is enabled. Only invited emails will be allowed into the portal.</p>
              </div>

              <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-[#0f3d2a]">What clinicians will see</h3>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li>• Current shifts and offers</li>
                  <li>• Clock in / clock out</li>
                  <li>• Hours worked and approval status</li>
                  <li>• Messages from your recruiter</li>
                  <li>• Suggested review prompt after a completed shift</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Welcome back</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#0f3d2a]">{email ?? "Clinician"}</h2>
                    <p className="mt-1 text-slate-700">RN · Greater Houston · Available</p>
                  </div>
                  <button type="button" onClick={handleSignOut} className="inline-flex items-center justify-center rounded-full border border-[#0f3d2a]/20 px-5 py-3 text-sm font-semibold text-[#0f3d2a]">
                    Sign out
                  </button>
                </div>
              </div>

              {step === "review" ? (
                <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">After shift</p>
                    <h3 className="mt-3 text-2xl font-semibold text-[#0f3d2a]">Facility review prompt</h3>
                    <p className="mt-3 text-slate-700">Suggested Google review text:</p>
                    <div className="mt-4 rounded-2xl bg-[#f9f5ee] p-4 text-slate-700">{suggestedPrompt}</div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a href="https://g.page/r" className="rounded-full bg-[#c9a84c] px-5 py-3 text-sm font-semibold text-[#0f3d2a]">Open Google review link</a>
                      <button type="button" onClick={() => setStep("portal")} className="rounded-full border border-[#0f3d2a]/20 px-5 py-3 text-sm font-semibold text-[#0f3d2a]">
                        Continue to dashboard
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-[#0f3d2a]">Today’s status</h3>
                    <div className="mt-5 space-y-4 text-sm text-slate-700">
                      <p>Shift hours pending final approval</p>
                      <p>Clock in location verified</p>
                      <p>Recruiter message received</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  {shifts.map((shift) => (
                    <div key={`${shift.facility}-${shift.time}`} className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-[#0f3d2a]">{shift.facility}</h3>
                        <span className="rounded-full bg-[#f9f5ee] px-3 py-1 text-xs font-semibold text-[#0f3d2a]">{shift.status}</span>
                      </div>
                      <p className="mt-3 text-slate-700">{shift.role}</p>
                      <p className="mt-2 text-slate-700">{shift.time}</p>
                      <p className="mt-2 font-semibold text-[#0f3d2a]">{shift.rate}</p>
                      <div className="mt-5 flex gap-3">
                        <button type="button" className="rounded-full bg-[#0f3d2a] px-4 py-2 text-sm font-semibold text-white">Clock In</button>
                        <button type="button" className="rounded-full border border-[#0f3d2a]/20 px-4 py-2 text-sm font-semibold text-[#0f3d2a]">Message</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
