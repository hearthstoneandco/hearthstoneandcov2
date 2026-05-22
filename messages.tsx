"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackThreads = [
  { id: "fallback-1", from: "Renaye", message: "Green Oaks shift is confirmed for tomorrow.", time: "8:05 AM" },
  { id: "fallback-2", from: "Sarah M.", message: "I’m on the way and will clock in at 6:50.", time: "8:12 AM" },
  { id: "fallback-3", from: "Portal", message: "Clock-in reminder scheduled.", time: "8:15 AM" },
];

export default function MessagesPage() {
  const [sent, setSent] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const [recipientOptions, setRecipientOptions] = useState<{ id: string; label: string }[]>([]);
  const [threads, setThreads] = useState(fallbackThreads);
  const [recipientLookup, setRecipientLookup] = useState<Record<string, string>>({});
  const [senderLookup, setSenderLookup] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      supabase.from("messages").select("id, from_user_id, message_text, created_at"),
      supabase.from("user_profiles").select("id, first_name, last_name, user_type"),
    ]).then(([messagesResult, profilesResult]) => {
      const { data: messages } = messagesResult;
      const { data: profiles } = profilesResult;

      if (messages?.length) {
        setThreads(
          messages.map((item: any, index: number) => ({
            id: item.id ?? `message-${index}`,
            from: item.from_user_id ?? "User",
            message: item.message_text ?? "",
            time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Just now",
          }))
        );
      }

      if (profiles?.length) {
        const lookup = profiles.reduce((acc: Record<string, string>, item: any) => {
          acc[item.id] = `${item.first_name ?? "User"} ${item.last_name ?? ""}`.trim();
          return acc;
        }, {});

        setRecipientLookup(lookup);
        setSenderLookup(lookup);
        setRecipientOptions(
          profiles.map((item: any) => ({
            id: item.id,
            label: lookup[item.id],
          }))
        );

        setThreads((current) => current.map((thread) => ({
          ...thread,
          from: lookup[thread.from] ?? thread.from,
        })));
      }
    });
  }, []);

  const handleSend = async () => {
    const { data } = await supabase.auth.getSession();
    const fromUserId = data.session?.user.id;
    if (!fromUserId) return;

    const { error } = await supabase.from("messages").insert({
      from_user_id: fromUserId,
      to_user_id: recipient,
      message_text: messageText,
      message_type: "text",
    });

    if (!error) setSent(true);
  };

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Messages</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Keep shift communication in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Use this for questions, updates, and dispute resolution.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Conversation
              </h2>
              <div className="mt-6 space-y-4">
                {threads.map((thread) => (
                  <div key={thread.id} className="rounded-2xl bg-[#f9f5ee] p-4">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <span>{senderLookup[thread.from] ?? thread.from}</span>                      <span>{thread.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{thread.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#0f3d2a]">Send message</h3>
              <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="mt-5 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none">
                <option value="">Select recipient</option>
                {recipientOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>



















































































              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} className="mt-4 w-full rounded-2xl border border-[#0f3d2a]/15 bg-white px-4 py-3 text-sm outline-none" rows={5} placeholder="Message" />
              <button onClick={handleSend} className="mt-6 rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white">
                Send message
              </button>
              {sent && <div className="mt-4 text-sm font-semibold text-[#0f3d2a]">Message sent.</div>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
