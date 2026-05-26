"use client";

import { useState } from "react";

const navLinks = [
  { label: "For Facilities", href: "/for-healthcare-facilities" },
  { label: "Clinician Portal", href: "/clinician-portal" },
  { label: "Admin Portal", href: "/admin-portal" },
  { label: "Join Network", href: "/join-our-network" },
  { label: "Shifts", href: "/shifts" },
  { label: "Matching", href: "/matching" },
  { label: "Clocking", href: "/clocking" },
  { label: "Approvals", href: "/approvals" },
  { label: "Messages", href: "/messages" },
  { label: "Payroll", href: "/payroll" },
  { label: "Ratings", href: "/ratings" },
  { label: "Audit Logs", href: "/audit-logs" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#0f3d2a]/10 bg-[#f9f5ee]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f3d2a] text-[#c9a84c] font-semibold">H</div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-[#0f3d2a]">HEARTHSTONE & CO.</div>
            <div className="text-[11px] tracking-[0.24em] text-[#7d6419]">WORKFORCE SOLUTIONS</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-[#0f3d2a]/75 transition-colors hover:text-[#0f3d2a]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="/clinician-portal" className="rounded-full border border-[#0f3d2a]/15 px-5 py-2.5 text-sm font-semibold text-[#0f3d2a]">
            Clinician Login
          </a>
          <a href="/admin-portal" className="rounded-full bg-[#0f3d2a] px-5 py-2.5 text-sm font-semibold text-white">
            Admin Login
          </a>
        </div>

        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span className={`block h-0.5 w-6 bg-[#0f3d2a] transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-[#0f3d2a] transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-[#0f3d2a] transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#0f3d2a]/10 bg-[#f9f5ee] px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-base font-medium text-[#0f3d2a]/80" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <a href="/clinician-portal" className="rounded-full border border-[#0f3d2a]/15 px-5 py-3 text-center text-sm font-semibold text-[#0f3d2a]">
              Clinician Login
            </a>
            <a href="/admin-portal" className="rounded-full bg-[#0f3d2a] px-5 py-3 text-center text-sm font-semibold text-white">
              Admin Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
