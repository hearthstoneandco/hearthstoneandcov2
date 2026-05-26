export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f3d2a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a84c] text-[#0f3d2a] font-semibold">H</div>
              <div>
                <div className="text-sm font-semibold tracking-wide">HEARTHSTONE & CO.</div>
                <div className="text-xs tracking-[0.24em] text-[#c9a84c]">WORKFORCE SOLUTIONS</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/65">
              Veteran-owned healthcare staffing for Greater Houston. Organized support for facilities and clinicians.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Portals</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="/clinician-portal" className="hover:text-white">Clinician Portal</a></li>
              <li><a href="/admin-portal" className="hover:text-white">Admin Portal</a></li>
              <li><a href="/join-our-network" className="hover:text-white">Join Our Network</a></li>
              <li><a href="/admin-invites" className="hover:text-white">Invite Management</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="/for-healthcare-facilities" className="hover:text-white">For Facilities</a></li>
              <li><a href="/shifts" className="hover:text-white">Shifts</a></li>
              <li><a href="/matching" className="hover:text-white">Matching</a></li>
              <li><a href="/clocking" className="hover:text-white">Clocking</a></li>
              <li><a href="/approvals" className="hover:text-white">Approvals</a></li>
              <li><a href="/messages" className="hover:text-white">Messages</a></li>
              <li><a href="/payroll" className="hover:text-white">Payroll</a></li>
              <li><a href="/ratings" className="hover:text-white">Ratings</a></li>
              <li><a href="/facility-profile" className="hover:text-white">Facility Profile</a></li>
              <li><a href="/clinician-profile" className="hover:text-white">Clinician Profile</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Follow</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-white/10 hover:text-white">f</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-white/10 hover:text-white">ig</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-white/10 hover:text-white">in</a>
            </div>
            <div className="mt-6">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Contact</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>Greater Houston, TX</li>
                <li>Harris · Fort Bend · Montgomery</li>
                <li><a href="mailto:renaye@hearthstoneandco.com" className="hover:text-white">renaye@hearthstoneandco.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row">
          <p>© {year} Hearthstone & Co. Workforce Solutions. All rights reserved.</p>
          <p>Veteran-Owned · JCAHO-Aligned · W-2 Employment</p>
        </div>
      </div>
    </footer>
  );
}
