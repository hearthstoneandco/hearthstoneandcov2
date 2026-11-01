import fs from "node:fs";
import path from "node:path";

// Runs automatically on every Netlify Forms submission (event name: submission-created).
// For the "newsletter" form only, forwards the signup to HubSpot's public Forms API so the
// contact lands in HubSpot with no manual step. No secrets: the portal ID and form GUID are
// public identifiers set as Netlify env vars HUBSPOT_PORTAL_ID and HUBSPOT_NEWSLETTER_FORM_GUID.
// If either is unset, this does nothing and the signup stays in Netlify Forms only.
// Other forms are routed to their inboxes by FORM_RECIPIENTS below; anything unlisted is ignored.

// Inbox routing (all also stored in Netlify Forms). Needs Netlify env var RESEND_API_KEY (a Resend API key for the
// verified hearthstoneandco.com domain). If unset, nothing is sent and the submission stays in Netlify Forms.
//  - careers-application  -> careers@     + applicant confirmation from careers@
//  - clinician-network    -> clinicians@  + applicant confirmation from clinicians@
//  - staffing-request, teaming-inquiry, bd-contact -> facilities@
//  - contact -> hello@ ; review-submission (future review form) -> reviews@
const CAREERS = { team: "Careers & Recruitment Team", address: "careers@hearthstoneandco.com" };
const CLINICIANS = { team: "Clinician Recruitment Team", address: "clinicians@hearthstoneandco.com" };
const FACILITIES = { team: "Facility Staffing Team", address: "facilities@hearthstoneandco.com" };
const BD = { team: "Business Development Team", address: "facilities@hearthstoneandco.com" };
const mailbox = (name, address) => `${name} <${address}>`;
const FORM_RECIPIENTS = {
  "careers-application": { to: CAREERS.address, label: "application", from: mailbox("Hearthstone Careers", CAREERS.address), confirm: { kind: "careers", ...CAREERS } },
  "clinician-network": { to: CLINICIANS.address, label: "clinician network signup", from: mailbox("Hearthstone Clinicians", CLINICIANS.address), confirm: { kind: "clinician", ...CLINICIANS } },
  "staffing-request": { to: FACILITIES.address, label: "facility staffing request", from: mailbox("Hearthstone Facilities", FACILITIES.address), confirm: { kind: "staffing", ...FACILITIES } },
  "staffing-request-full": { to: FACILITIES.address, label: "facility staffing request", from: mailbox("Hearthstone Facilities", FACILITIES.address), confirm: { kind: "staffing", ...FACILITIES } },
  "teaming-inquiry": { to: BD.address, label: "teaming inquiry", from: mailbox("Hearthstone Facilities", BD.address), confirm: { kind: "partner", ...BD } },
  "bd-contact": { to: BD.address, label: "business development inquiry", from: mailbox("Hearthstone Facilities", BD.address), confirm: { kind: "partner", ...BD } },
  "contact": { to: "hello@hearthstoneandco.com", label: "contact message", from: mailbox("Hearthstone", "hello@hearthstoneandco.com") },
  "reviews": { to: "reviews@hearthstoneandco.com", label: "review submission", from: mailbox("Hearthstone Reviews", "reviews@hearthstoneandco.com") },
  "review-submission": { to: "reviews@hearthstoneandco.com", label: "review submission", from: mailbox("Hearthstone Reviews", "reviews@hearthstoneandco.com") },
};
const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pretty = (k) => String(k).replace(/^q_/, "").replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const isFile = (v) => v && typeof v === "object" && typeof v.url === "string";

// Question wording for each role comes straight from the ROLES table in careers-portal.html
// (single source of truth), so the email shows the real question next to each answer.
let rolesCache;
function loadRoles() {
  if (rolesCache !== undefined) return rolesCache;
  rolesCache = null;
  const roots = [process.env.LAMBDA_TASK_ROOT, process.cwd(), path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..")].filter(Boolean);
  for (const r of roots) {
    try {
      const html = fs.readFileSync(path.join(r, "careers-portal.html"), "utf8");
      const m = html.match(/const ROLES = (\{[\s\S]*?\});\n/);
      if (m) { rolesCache = JSON.parse(m[1]); break; }
    } catch (e) { /* try next root */ }
  }
  return rolesCache;
}

const CORE = ["full_name", "name", "first_name", "last_name", "contact_name", "reviewer-name", "facility_name", "company_name", "organization", "title", "email", "phone", "city", "live_in_texas", "work_authorized", "linkedin_url", "resume_link"];
const CORE_LABELS = { first_name: "First name", contact_name: "Contact name", "reviewer-name": "Reviewer name", company_name: "Company", organization: "Organization", state: "State", facility_type: "Facility type", coverage_type: "Coverage needed", clinician_count: "Number of clinicians needed", shifts: "Shifts needed", roles: "Roles needed", start_date: "Desired start date", duration: "Expected duration", staffing_needs: "Staffing needs", urgency: "Urgency", engagement_type: "Engagement type", region: "Region", vehicle: "Contract vehicles", clinicians: "Clinician types", cage_uei: "CAGE / UEI", reason: "Reason for contacting", message: "Message", type: "Inquiry type", "reviewer-role": "Reviewer role", "reviewer-location": "Reviewer location", rating: "Rating", "review-text": "Review", last_name: "Last name", facility_name: "Facility / organization", title: "Title", full_name: "Full name", name: "Name", email: "Email", phone: "Phone", city: "City", live_in_texas: "Lives in Texas", work_authorized: "Authorized to work in the U.S. (no sponsorship)", linkedin_url: "LinkedIn profile", resume_link: "Resume / LinkedIn / portfolio link" };
const NOTE_KEYS = ["extra", "notes"];

async function emailSubmission(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "resend not configured";
  const route = FORM_RECIPIENTS[payload.form_name];
  if (!route) return "ignored";
  const d = { ...(payload.data || {}) };
  if (!d.email && d["reviewer-email"]) d.email = d["reviewer-email"];
  if (d["bot-field"]) return "skipped";

  const roles = loadRoles();
  const role = roles && roles[d.role];
  const labelFor = (k) => {
    const q = role && role.questions.find((x) => x.name === k);
    return q ? q.label : CORE_LABELS[k] || pretty(k);
  };
  const val = (v) => (Array.isArray(v) ? v.join(", ") : String(v));
  const skip = new Set(["bot-field", "form-name", "role", "reviewer-email", "ip", "user_agent", "referrer"]);
  const present = (k) => !skip.has(k) && d[k] !== "" && d[k] != null && !isFile(d[k]);

  const files = Object.entries(d).filter(([, v]) => isFile(v) && (v.size == null || v.size > 0));
  const core = CORE.filter(present);
  const screening = Object.keys(d).filter((k) => /^q_/.test(k) && present(k));
  const notes = NOTE_KEYS.filter(present);
  const other = Object.keys(d).filter((k) => present(k) && !CORE.includes(k) && !NOTE_KEYS.includes(k) && !/^q_/.test(k) && !/^sms/i.test(k));
  const consent = Object.keys(d).filter((k) => present(k) && /^sms/i.test(k));

  const person = d.full_name || d.name || d.contact_name || d["reviewer-name"] || [d.first_name, d.last_name].filter(Boolean).join(" ");
  // Business inquiries lead with the organization; the contact person is shown beneath it. Applications and
  // clinician signups lead with the person.
  const org = ["staffing-request", "staffing-request-full", "teaming-inquiry", "bd-contact"].includes(payload.form_name) ? (d.facility_name || d.company_name || d.organization || "") : "";
  const who = org || person || d.email || "New applicant";
  const roleTitle = role ? role.title : d.role ? pretty(d.role) : "";
  const subject = route.label === "application" ? `Application: ${roleTitle || "General"} - ${who}` : `${route.label[0].toUpperCase()}${route.label.slice(1)}: ${who}`;

  // Attach uploaded files (Netlify gives a short-lived URL, so fetch now).
  const attachments = [];
  const fileNotes = [];
  for (const [k, f] of files) {
    const name = f.filename || `${k}`;
    try {
      const r = await fetch(f.url);
      if (!r.ok) throw new Error(String(r.status));
      attachments.push({ filename: name, content: Buffer.from(await r.arrayBuffer()).toString("base64") });
      fileNotes.push(`${pretty(k)}: ${name} (attached)`);
    } catch (e) {
      fileNotes.push(`${pretty(k)}: ${name} (could not attach; find it in Netlify Forms)`);
    }
  }
  if (route.label === "application" && !files.length) fileNotes.push("No resume or cover letter file was uploaded.");

  const row = (k, v) => `<tr><td style="padding:6px 14px 6px 0;color:#6b6b6b;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#1a1a1a">${v}</td></tr>`;
  const link = (k) => {
    const v = esc(val(d[k]));
    if (k === "email") return `<a href="mailto:${v}">${v}</a>`;
    if (k === "phone") return `<a href="tel:${v}">${v}</a>`;
    if (/^https?:\/\//i.test(val(d[k]))) return `<a href="${v}">${v}</a>`;
    return v;
  };
  const section = (t) => `<h3 style="margin:26px 0 8px;font:600 13px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#1A3D2E;border-bottom:2px solid #C9A84C;padding-bottom:6px">${t}</h3>`;
  const qa = (k) => `<p style="margin:12px 0 2px;color:#6b6b6b;font-size:13px">${esc(labelFor(k))}</p><p style="margin:0;white-space:pre-wrap">${esc(val(d[k]))}</p>`;

  const html = `<div style="font:15px/1.5 Arial,sans-serif;color:#1a1a1a;max-width:680px;margin:0 auto">
<div style="background:#1A3D2E;color:#fff;padding:20px 24px;border-bottom:4px solid #C9A84C">
<div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#C9A84C">${route.label === "application" ? "New application" : org ? `New ${esc(route.label)}` : "New submission"}</div>
<div style="font:600 22px Georgia,serif;margin-top:4px">${esc(who)}</div>
${roleTitle ? `<div style="margin-top:2px;opacity:.9">${esc(roleTitle)}</div>` : org && person ? `<div style="margin-top:2px;opacity:.9">Contact: ${esc(person)}</div>` : ""}</div>
<div style="padding:4px 24px 24px;border:1px solid #e5e5e5;border-top:0">
${section(route.label === "application" ? "Contact &amp; eligibility" : "Contact")}<table style="border-collapse:collapse">${core.map((k) => row(labelFor(k), link(k))).join("")}</table>
${other.length ? section("Details") + `<table style="border-collapse:collapse">${other.map((k) => row(labelFor(k), `<span style="white-space:pre-wrap">${esc(val(d[k]))}</span>`)).join("")}</table>` : ""}
${screening.length ? section("Screening answers") + screening.map(qa).join("") : ""}
${notes.length ? section("Additional notes") + notes.map((k) => `<p style="margin:8px 0;white-space:pre-wrap">${esc(val(d[k]))}</p>`).join("") : ""}
${fileNotes.length ? section("Documents") + `<ul style="margin:6px 0;padding-left:20px">${fileNotes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
${consent.length ? section("Consent") + `<table style="border-collapse:collapse">${consent.map((k) => row(labelFor(k), esc(val(d[k])))).join("")}</table>` : ""}
<p style="margin-top:24px;color:#6b6b6b;font-size:12px">Reply to this email to respond directly to the applicant. Submitted ${esc(payload.created_at || "")} via hearthstoneandco.com${d.referrer ? ` (${esc(d.referrer)})` : ""}.</p>
</div></div>`;

  const text = [
    `${route.label === "application" ? "NEW APPLICATION" : "NEW SUBMISSION"}: ${who}${roleTitle ? ` - ${roleTitle}` : ""}`,
    "", ...core.map((k) => `${labelFor(k)}: ${val(d[k])}`),
    ...other.map((k) => `${labelFor(k)}: ${val(d[k])}`),
    ...(screening.length ? ["", "SCREENING ANSWERS", ...screening.map((k) => `${labelFor(k)}\n${val(d[k])}\n`)] : []),
    ...(notes.length ? ["", "NOTES", ...notes.map((k) => val(d[k]))] : []),
    ...(fileNotes.length ? ["", "DOCUMENTS", ...fileNotes] : []),
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: (payload.form_name === "careers-application" && process.env.CAREERS_FROM) || route.from,
      to: [route.to],
      reply_to: d.email || undefined,
      subject,
      html,
      text,
      attachments: attachments.length ? attachments : undefined,
    }),
  });
  const sent = res.ok ? "ok" : `resend ${res.status}`;
  let confirmed = "";
  if (route.confirm && d.email) {
    try { confirmed = " confirm:" + (await sendConfirmation({ key, route, d, person, roleTitle, val })); } catch (e) { confirmed = " confirm:error"; }
  }
  return sent + confirmed;
}

// Applicant confirmation, sent from the matching mailbox. Specific to the application type; makes no promise of
// a response, interview, timeline or placement.
async function sendConfirmation({ key, route, d, person, roleTitle, val }) {
  const c = route.confirm;
  const first = String(person || "").trim().split(/\s+/)[0] || "there";
  const isApp = c.kind === "careers" || c.kind === "clinician";
  const discipline = c.kind === "clinician" ? [d.license_type, d.assignment_type].filter(Boolean).map(val).join(" / ") : "";
  const appliedFor = c.kind === "careers" ? (roleTitle ? `your application for the ${roleTitle} position` : "your application") : "your interest in joining the Hearthstone & Co. clinician network";
  const detail = {
    careers: `Thank you for applying to join the Hearthstone &amp; Co. internal team.`,
    clinician: `Thank you for applying to join the Hearthstone &amp; Co. clinician network${discipline ? ` as ${/^(rn|lvn|mri|[aeiou])/i.test(discipline) ? "an" : "a"} ${esc(discipline)}` : ""}.`,
    staffing: `Thank you for submitting your staffing request to Hearthstone &amp; Co.`,
    partner: `Thank you for reaching out to Hearthstone &amp; Co. about working together.`,
  }[c.kind];
  const body = isApp
    ? `The ${esc(c.team)} will be reviewing your application and will reach out if you are selected to move forward.`
    : `A member of our ${esc(c.team)} will reach out within 24-48 hours to review your ${c.kind === "staffing" ? "request" : "inquiry"} with you.`;
  const subject = { careers: `We received your application${roleTitle ? `: ${roleTitle}` : ""}`, clinician: "We received your clinician application", staffing: "We received your staffing request", partner: "We received your inquiry" }[c.kind];
  const eyebrow = isApp ? "Application received" : c.kind === "staffing" ? "Request received" : "Inquiry received";
  const headline = isApp ? "Thank you for your application" : c.kind === "staffing" ? "Thank you for your request" : "Thank you for reaching out";
  const received = isApp ? (c.kind === "careers" ? `We have received ${appliedFor}.` : "We have received your application.") : c.kind === "staffing" ? "We have received your request." : "We have received your inquiry.";
  const closing = isApp ? "There is nothing more you need to do right now. If you need to add anything, simply reply to this email." : "If you have anything to add in the meantime, simply reply to this email or call (713) 938-3989.";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f1ea">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff">
<tr><td align="center" bgcolor="#1A3D2E" style="background:#1A3D2E;padding:24px;border-bottom:4px solid #C9A84C"><a href="https://hearthstoneandco.com"><img src="https://hearthstoneandco.com/logo.png" width="80" height="80" alt="Hearthstone &amp; Co. Workforce Solutions" style="display:block;border:0;background:#0F3D2A;color:#C9A84C;font:14px Georgia,serif"></a></td></tr>
<tr><td style="padding:32px 36px 8px;font:12px 'Courier New',monospace;letter-spacing:.12em;text-transform:uppercase;color:#C9A84C">${eyebrow}</td></tr>
<tr><td style="padding:0 36px;font:600 26px Georgia,serif;color:#1A3D2E">${headline}</td></tr>
<tr><td style="padding:18px 36px 0;font:16px/1.6 Arial,sans-serif;color:#1a1a1a">
<p style="margin:0 0 14px">Hi ${esc(first)},</p>
<p style="margin:0 0 14px">${detail} ${received}</p>
<p style="margin:0 0 14px">${body}</p>
<p style="margin:0 0 14px">${closing}</p></td></tr>
<tr><td style="padding:8px 36px 32px;font:16px/1.6 Arial,sans-serif;color:#1a1a1a">Sincerely,<br><strong style="color:#1A3D2E">The ${esc(c.team)}</strong><br>Hearthstone &amp; Co. Workforce Solutions</td></tr>
<tr><td bgcolor="#1A3D2E" align="center" style="background:#1A3D2E;padding:18px 24px;font:12px/1.5 Arial,sans-serif;color:#ffffff">Hearthstone &amp; Co. Workforce Solutions LLC &middot; Katy, TX &middot; (713) 938-3989${isApp ? "<br>Hearthstone &amp; Co. is an equal opportunity employer." : ""}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [`Hi ${first},`, "", `${detail.replace(/&amp;/g, "&").replace(/<[^>]+>/g, "")} ${received}`, "",
    body.replace(/&amp;/g, "&"), "",
    closing, "",
    "Sincerely,", `The ${c.team}`, "Hearthstone & Co. Workforce Solutions", "(713) 938-3989"].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: (c.kind === "careers" && process.env.CAREERS_FROM) || mailbox(c.team, c.address), to: [String(d.email).trim()], reply_to: c.address, subject, html, text }),
  });
  return res.ok ? "ok" : `resend ${res.status}`;
}

export default async (req) => {
  try {
    const { payload } = await req.json();
    if (payload && FORM_RECIPIENTS[payload.form_name]) {
      return new Response(await emailSubmission(payload), { status: 200 });
    }
    if (!payload || payload.form_name !== "newsletter") return new Response("ignored", { status: 200 });

    const portal = process.env.HUBSPOT_PORTAL_ID;
    const form = process.env.HUBSPOT_NEWSLETTER_FORM_GUID;
    if (!portal || !form) return new Response("hubspot not configured", { status: 200 });

    const d = payload.data || {};
    const email = String(d.email || "").trim();
    if (!email || d["bot-field"]) return new Response("skipped", { status: 200 });

    const fields = [{ name: "email", value: email }];
    const name = String(d.name || "").trim();
    if (name) {
      const [first, ...rest] = name.split(/\s+/);
      fields.push({ name: "firstname", value: first });
      if (rest.length) fields.push({ name: "lastname", value: rest.join(" ") });
    }

    const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(portal)}/${encodeURIComponent(form)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: { pageUri: payload.site_url ? `${payload.site_url}/newsletter` : "https://hearthstoneandco.com/newsletter", pageName: "Newsletter signup" },
      }),
    });
    return new Response(res.ok ? "ok" : `hubspot ${res.status}`, { status: 200 });
  } catch (e) {
    return new Response("error", { status: 200 });
  }
};
