// Runs automatically on every Netlify Forms submission (event name: submission-created).
// For the "newsletter" form only, forwards the signup to HubSpot's public Forms API so the
// contact lands in HubSpot with no manual step. No secrets: the portal ID and form GUID are
// public identifiers set as Netlify env vars HUBSPOT_PORTAL_ID and HUBSPOT_NEWSLETTER_FORM_GUID.
// If either is unset, this does nothing and the signup stays in Netlify Forms only.
// All other forms are ignored.

export default async (req) => {
  try {
    const { payload } = await req.json();
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
