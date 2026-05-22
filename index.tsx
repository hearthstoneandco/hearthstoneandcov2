const facilityStats = [
  { value: "24–72h", label: "placement guarantee" },
  { value: "W-2", label: "employment model" },
  { value: "Houston", label: "local market focus" },
  { value: "Named", label: "recruiter accountability" },
];

const pathways = [
  {
    title: "I need staff",
    description:
      "Fast coverage for SNFs, ALFs, hospitals, clinics, and outpatient facilities across Greater Houston.",
    href: "/for-healthcare-facilities",
    accent: "#0f3d2a",
  },
  {
    title: "I want work",
    description:
      "Flexible RN, LVN, and CNA opportunities with clear pay, support, and credential tracking.",
    href: "/clinician-jobs",
    accent: "#c9a84c",
  },
];

const differentiators = [
  "Veteran-owned and operationally disciplined",
  "W-2 clinicians for stronger accountability",
  "JCAHO-aligned credentialing workflow",
  "OIG/SAM-cleared and license-tracked talent",
  "Named recruiter on every engagement",
  "No long-term contract pressure for facilities",
];

const process = [
  {
    step: "01",
    title: "Tell us the need",
    copy: "Share the role, setting, shift pattern, and start date.",
  },
  {
    step: "02",
    title: "We match and verify",
    copy: "We shortlist credentialed clinicians and confirm fit, compliance, and availability.",
  },
  {
    step: "03",
    title: "Coverage starts fast",
    copy: "Your named recruiter keeps the handoff tight and the communication clear.",
  },
];

const roles = ["RN", "LVN", "CNA", "Per diem", "Contract", "Travel", "Temp-to-hire"];

export default function Home() {
  return (
    <main className="pt-[72px]">
      <section className="relative overflow-hidden bg-[#0f3d2a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.18),transparent_45%),linear-gradient(135deg,rgba(15,61,42,0.98),rgba(15,61,42,0.92))]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a84c]">
              Veteran-owned healthcare staffing
            </p>
            <h1
              className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Credentialed clinicians for Greater Houston facilities in 24–72 hours.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
              Hearthstone & Co. places RN, LVN, and CNA talent for SNFs, ALFs, hospitals,
              clinics, and outpatient facilities. Named recruiter. W-2 model. Compliance-first.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/for-healthcare-facilities"
                className="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#0f3d2a] transition-colors hover:bg-[#d7b860]"
              >
                Request Coverage
              </a>
              <a
                href="/clinician-jobs"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Find Work
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
              >
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#0f3d2a]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {facilityStats.map((item) => (
            <div key={item.label} className="rounded-2xl bg-[#f9f5ee] p-5 text-center">
              <div className="text-2xl font-semibold text-[#0f3d2a]">{item.value}</div>
              <div className="mt-1 text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Two clear paths</p>
          <h2
            className="mt-4 text-3xl font-semibold text-[#0f3d2a] sm:text-4xl"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Built for facilities and clinicians. No confusion.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {pathways.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: `${item.accent}12`, color: item.accent }}
              >
                <span className="text-xl">↗</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#0f3d2a]">{item.title}</h3>
              <p className="mt-3 max-w-lg text-slate-600">{item.description}</p>
              <div className="mt-6 text-sm font-semibold text-[#0f3d2a] transition-transform group-hover:translate-x-1">
                Explore
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-[#f9f5ee]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Why Hearthstone</p>
              <h2
                className="mt-4 text-3xl font-semibold text-[#0f3d2a] sm:text-4xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Premium staffing should feel reliable, not rushed.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                We combine local Houston market knowledge with disciplined operations, fast response times, and clean communication.
                That means fewer surprises for facilities and better support for clinicians.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {differentiators.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#0f3d2a]/10 bg-white p-5 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-[#0f3d2a] p-8 text-white shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a84c]">Core roles</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90"
                  >
                    {role}
                  </span>
                ))}
              </div>
              <div className="mt-8 space-y-4 text-sm leading-7 text-white/80">
                <p>Named recruiter on every engagement.</p>
                <p>Month-to-month flexibility for facilities.</p>
                <p>Clear support for clinicians from application through placement.</p>
                <p>Compliance and credentialing handled end to end.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">How it works</p>
          <h2
            className="mt-4 text-3xl font-semibold text-[#0f3d2a] sm:text-4xl"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Fast, clear, and accountable.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {process.map((item) => (
            <div key={item.step} className="rounded-[28px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm">
              <div className="text-sm font-semibold tracking-[0.25em] text-[#c9a84c]">{item.step}</div>
              <h3 className="mt-4 text-xl font-semibold text-[#0f3d2a]">{item.title}</h3>
              <p className="mt-3 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Compliance and credentialing</p>
              <h2
                className="mt-4 text-3xl font-semibold text-[#0f3d2a] sm:text-4xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Built to reduce risk for every placement.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
                We keep the process tight with credential tracking, exclusion screening, and recruiter accountability.
                Facilities get qualified coverage. Clinicians get a clean, organized experience.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "JCAHO-aligned credentialing",
                "OIG/SAM screening",
                "License expiration tracking",
                "W-2 employment model",
                "Pre-credentialed talent",
                "Clear handoff and support",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-[#f9f5ee] p-5 text-sm font-medium text-[#0f3d2a] shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0f3d2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">Portals</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                Separate experiences for clinicians and admins.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Keep role-based access simple. Clinicians see onboarding, credentials, and assignments.
                Admins see pipeline, compliance, and shift control.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href="/clinician-portal" className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                <div className="text-sm font-semibold text-[#c9a84c]">Clinician Portal</div>
                <div className="mt-3 text-lg font-semibold">Supportive, simple, mobile-first.</div>
              </a>
              <a href="/admin-portal" className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                <div className="text-sm font-semibold text-[#c9a84c]">Admin Portal</div>
                <div className="mt-3 text-lg font-semibold">Operational, structured, accountable.</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
        <div className="rounded-[32px] border border-[#0f3d2a]/10 bg-white p-8 shadow-sm lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f3d2a]">Request coverage</p>
              <h2 className="mt-4 text-3xl font-semibold text-[#0f3d2a]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Need staff now? Start here.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-700">
                Tell us the role, site, and shift. We’ll route it to the right recruiter and keep the process moving.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#0f3d2a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153f2d]"
            >
              Contact Hearthstone
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
