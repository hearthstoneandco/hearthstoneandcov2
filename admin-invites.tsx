"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackInvites = [
  { email: "renaye@hearthstoneandco.com", role: "hearthstone_admin" },
  { email: "demo.clinician@hearthstoneandco.com", role: "clinician" },
  { email: "facility.contact@hearthstoneandco.com", role: "facility_admin" },
];

export default function AdminInvitesPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("clinician");
  const [invites, setInvites] = useState(fallbackInvites);

  useEffect(() => {
    supabase.from("invite_emails").select("email, role").then(({ data }) => {
      if (data?.length) setInvites(data);
    });
  }, []);

  const handleSave = async () => {
    const nextInvite = { email: email.toLowerCase().trim(), role };
    const { error } = await supabase.from("invite_emails").insert(nextInvite);
    if (!error) {
      setInvites((current) => [nextInvite, ...current.filter((item) => item.email !== nextInvite.email)]);
      setEmail("");
      setRole("clinician");
    }
  };

  const handleDelete = async (targetEmail: string) => {
    const { error } = await supabase.from("invite_emails").delete().eq("email", targetEmail);
    if (!error) {
      setInvites((current) => current.filter((item) => item.email !== targetEmail));
    }
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Invite management</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Control who can enter the portal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Add approved clinicians, facility admins, and Hearthstone admins here.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Add invite
              </h2>
              <div className="mt-5 space-y-4">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="clinician">clinician</option>
                  <option value="facility_admin">facility_admin</option>
                  <option value="hearthstone_admin">hearthstone_admin</option>
                </select>
                <button onClick={handleSave} className="w-full rounded-full bg-[#0f3d2a] px-5 py-3 text-sm font-semibold text-white">
                  Save invite
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Current invited emails
              </h2>
              <div className="mt-6 space-y-4">
                {invites.map((invite) => (
                  <div key={invite.email} className="flex items-center justify-between gap-4 rounded-2xl border border-[#0f3d2a]/10 bg-[#f9f5ee] p-4">
                    <div>
                      <div className="font-semibold text-[#0f3d2a]">{invite.email}</div>
                      <div className="text-sm text-slate-600">{invite.role}</div>
                    </div>
                    <button onClick={() => handleDelete(invite.email)} className="rounded-full border border-[#0f3d2a]/15 px-4 py-2 text-xs font-semibold text-[#0f3d2a]">
                      Remove
                    </button>
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
