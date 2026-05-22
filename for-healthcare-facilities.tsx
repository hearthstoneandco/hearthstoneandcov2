const benefits = [
  "Fast coverage for urgent gaps",
  "W-2 clinicians for stronger accountability",
  "JCAHO-aligned credentialing",
  "OIG/SAM-cleared talent",
  "Named recruiter on every engagement",
  "Month-to-month flexibility",
];

const models = [
  {
    title: "Per diem",
    copy: "Rapid support for day-to-day staffing gaps and census swings.",
  },
  {
    title: "Contract",
    copy: "Structured coverage for longer placements and recurring needs.",
  },
  {
    title: "Travel",
    copy: "Mobile clinicians for urgent demand and specialty fill-ins.",
  },
  {
    title: "Temp-to-hire",
    copy: "A low-friction path to evaluate fit before long-term commitment.",
  },
];

export default function FacilitiesPage() {
  return (
    <main className="pt-[72px]">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">For facilities</p>
            <h1 className="mt-4 text-4xl font-semibold text-[#0f3d2a] sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              Staffing that feels organized, fast, and accountable.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Hearthstone & Co. supports SNFs, ALFs, hospitals, clinics, and outpatient facilities across Greater Houston with credentialed clinicians and clear communication.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f9f5ee]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-2xl border border-[#0f3d2a]/10 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-[#0f3d2a]">{benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Staffing models</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Flexible coverage built around your schedule.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {models.map((model) => (
              <div key={model.title} className="rounded-[28px] border border-[#0f3d2a]/10 bg-[#f9f5ee] p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-[#0f3d2a]">{model.title}</h3>
                <p className="mt-3 text-slate-700">{model.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">Next step</p>
              <h2 className="mt-4 text-3xl font-semibold" style={{ fontFamily: "var(--font-cormorant)" }}>
                Request coverage from a named recruiter.
              </h2>
              <p className="mt-4 max-w-2xl text-white/80">
                Tell us what you need and we’ll route the request quickly.
              </p>
            </div>
            <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#0f3d2a]">
              Request Staffing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
