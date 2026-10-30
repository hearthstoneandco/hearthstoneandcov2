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

async function emailCareers(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "resend not configured";
  const route = FORM_RECIPIENTS[payload.form_name];
  if (!route) return "ignored";
  const d = payload.data || {};
  if (d["bot-field"]) return "skipped";
  const rows = Object.entries(d)
    .filter(([k, v]) => k !== "bot-field" && k !== "form-name" && v !== "" && v != null)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><b>${esc(k)}</b></td><td>${esc(typeof v === "object" ? (v.url || JSON.stringify(v)) : v)}</td></tr>`)
    .join("");
  const who = d.name || d.full_name || d.email || "New submission";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CAREERS_FROM || route.from,
      to: [route.to],
      reply_to: d.email || undefined,
      subject: `New ${route.label}: ${who}`,
      html: `<table>${rows}</table>`,
    }),
  });
  return res.ok ? "ok" : `resend ${res.status}`;
}

export default async (req) => {
  try {
    const { payload } = await req.json();
    if (payload && FORM_RECIPIENTS[payload.form_name]) {
      return new Response(await emailCareers(payload), { status: 200 });
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
