import fs from "node:fs";
import path from "node:path";

// Runs automatically on every Netlify Forms submission (event name: submission-created).
// For the "newsletter" form only, forwards the signup to HubSpot's public Forms API so the
// contact lands in HubSpot with no manual step. No secrets: the portal ID and form GUID are
// public identifiers set as Netlify env vars HUBSPOT_PORTAL_ID and HUBSPOT_NEWSLETTER_FORM_GUID.
// If either is unset, this does nothing and the signup stays in Netlify Forms only.
// Careers and clinician-network forms are emailed straight to their inboxes (see below). All other forms are ignored.

// Careers applications go to careers@ and "Join Our Network" clinician signups go to clinicians@
// (in addition to being stored in Netlify Forms). Needs Netlify env var RESEND_API_KEY (a Resend API key for a verified
// hearthstoneandco.com sender). If unset, nothing is sent and the submission stays in Netlify Forms.
const FORM_RECIPIENTS = {
  "careers-application": { to: "careers@hearthstoneandco.com", label: "application", from: "Hearthstone Careers <careers@hearthstoneandco.com>" },
  "clinician-network": { to: "clinicians@hearthstoneandco.com", label: "clinician network signup", from: "Hearthstone Clinicians <clinicians@hearthstoneandco.com>" },
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

const CORE = ["full_name", "name", "email", "phone", "city", "live_in_texas", "work_authorized", "resume_link"];
const CORE_LABELS = { full_name: "Full name", name: "Name", email: "Email", phone: "Phone", city: "City", live_in_texas: "Lives in Texas", work_authorized: "Authorized to work in the U.S. (no sponsorship)", resume_link: "Resume / LinkedIn / portfolio link" };
const NOTE_KEYS = ["extra", "notes"];

async function emailSubmission(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "resend not configured";
  const route = FORM_RECIPIENTS[payload.form_name];
  if (!route) return "ignored";
  const d = payload.data || {};
  if (d["bot-field"]) return "skipped";

  const roles = loadRoles();
  const role = roles && roles[d.role];
  const labelFor = (k) => {
    const q = role && role.questions.find((x) => x.name === k);
    return q ? q.label : CORE_LABELS[k] || pretty(k);
  };
  const val = (v) => (Array.isArray(v) ? v.join(", ") : String(v));
  const skip = new Set(["bot-field", "form-name", "role"]);
  const present = (k) => !skip.has(k) && d[k] !== "" && d[k] != null && !isFile(d[k]);

  const files = Object.entries(d).filter(([, v]) => isFile(v) && (v.size == null || v.size > 0));
  const core = CORE.filter(present);
  const screening = Object.keys(d).filter((k) => /^q_/.test(k) && present(k));
  const notes = NOTE_KEYS.filter(present);
  const other = Object.keys(d).filter((k) => present(k) && !CORE.includes(k) && !NOTE_KEYS.includes(k) && !/^q_/.test(k) && !/^sms/i.test(k));
  const consent = Object.keys(d).filter((k) => present(k) && /^sms/i.test(k));

  const who = d.full_name || d.name || d.email || "New applicant";
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
<div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#C9A84C">${route.label === "application" ? "New application" : "New submission"}</div>
<div style="font:600 22px Georgia,serif;margin-top:4px">${esc(who)}</div>
${roleTitle ? `<div style="margin-top:2px;opacity:.9">${esc(roleTitle)}</div>` : ""}</div>
<div style="padding:4px 24px 24px;border:1px solid #e5e5e5;border-top:0">
${section("Contact &amp; eligibility")}<table style="border-collapse:collapse">${core.map((k) => row(labelFor(k), link(k))).join("")}</table>
${other.length ? section("Details") + `<table style="border-collapse:collapse">${other.map((k) => row(labelFor(k), esc(val(d[k])))).join("")}</table>` : ""}
${screening.length ? section("Screening answers") + screening.map(qa).join("") : ""}
${notes.length ? section("Additional notes") + notes.map((k) => `<p style="margin:8px 0;white-space:pre-wrap">${esc(val(d[k]))}</p>`).join("") : ""}
${section("Documents")}<ul style="margin:6px 0;padding-left:20px">${fileNotes.map((n) => `<li>${esc(n)}</li>`).join("") || "<li>None</li>"}</ul>
${consent.length ? section("Consent") + `<table style="border-collapse:collapse">${consent.map((k) => row(labelFor(k), esc(val(d[k])))).join("")}</table>` : ""}
<p style="margin-top:24px;color:#6b6b6b;font-size:12px">Reply to this email to respond directly to the applicant. Submitted ${esc(payload.created_at || "")} via hearthstoneandco.com.</p>
</div></div>`;

  const text = [
    `${route.label === "application" ? "NEW APPLICATION" : "NEW SUBMISSION"}: ${who}${roleTitle ? ` - ${roleTitle}` : ""}`,
    "", ...core.map((k) => `${labelFor(k)}: ${val(d[k])}`),
    ...other.map((k) => `${labelFor(k)}: ${val(d[k])}`),
    ...(screening.length ? ["", "SCREENING ANSWERS", ...screening.map((k) => `${labelFor(k)}\n${val(d[k])}\n`)] : []),
    ...(notes.length ? ["", "NOTES", ...notes.map((k) => val(d[k]))] : []),
    "", "DOCUMENTS", ...(fileNotes.length ? fileNotes : ["None"]),
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CAREERS_FROM || route.from,
      to: [route.to],
      reply_to: d.email || undefined,
      subject,
      html,
      text,
      attachments: attachments.length ? attachments : undefined,
    }),
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
