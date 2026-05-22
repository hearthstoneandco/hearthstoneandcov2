"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackLogs = [
  { id: "fallback-1", action: "shift_created", by: "Renaye", entity: "shift", time: "9:05 AM" },
  { id: "fallback-2", action: "approval_granted", by: "Facility Admin", entity: "approval", time: "10:22 AM" },
  { id: "fallback-3", action: "payroll_sent", by: "Renaye", entity: "payroll", time: "Friday 4:00 PM" },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(fallbackLogs);

  useEffect(() => {
    supabase.from("audit_logs").select("*").then(({ data }) => {
      if (data?.length) {
        setLogs(
          data.map((item: any, index: number) => ({
            id: item.id ?? `log-${index}`,
            action: item.action_type ?? item.action ?? "action",
            by: item.performed_by ?? item.by ?? "User",
            entity: item.entity_type ?? item.entity ?? "entity",
            time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Just now",
          }))
        );
      }
    });
  }, []);

  return (
    <main className="pt-[72px]">
      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">Audit logs</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Track every important action.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Keep a clear record of what happened, who did it, and when.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-[#0f3d2a]">{log.action}</div>
                    <div className="text-sm text-slate-600">{log.entity}</div>
                  </div>
                  <div className="text-sm text-slate-700">
                    <div><strong>By:</strong> {log.by}</div>
                    <div><strong>Time:</strong> {log.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
