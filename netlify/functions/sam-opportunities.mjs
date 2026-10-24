// (Redeploy 2026-10-23 #2: SAM_GOV_API_KEY now set in Netlify.)
// Read-only feed of public federal contract opportunities from SAM.gov
// that match Hearthstone's NAICS codes (561320, 561311). Used by internal
// agents. The API key stays server-side (Netlify env var SAM_GOV_API_KEY)
// and is never returned. Query parameters are ignored so the public cannot
// burn the API quota; responses are CDN-cached for 6 hours.

const NAICS = ["561320", "561311"];
const BASE = "https://api.sam.gov/prod/opportunities/v2/search";

const fmt = (d) =>
  `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`;

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
  "Netlify-CDN-Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
  "X-Robots-Tag": "noindex, nofollow",
};

export default async () => {
  const key = process.env.SAM_GOV_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 503,
      headers: { ...headers, "Cache-Control": "no-store", "Netlify-CDN-Cache-Control": "no-store" },
    });
  }
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 3600 * 1000);
  const seen = new Map();
  const errors = [];

  for (const ncode of NAICS) {
    const url = new URL(BASE);
    url.search = new URLSearchParams({
      api_key: key,
      postedFrom: fmt(from),
      postedTo: fmt(to),
      ncode,
      limit: "100",
      offset: "0",
    }).toString();
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        errors.push({ ncode, status: res.status });
        continue;
      }
      const data = await res.json();
      for (const o of data.opportunitiesData || []) {
        if (seen.has(o.noticeId)) continue;
        seen.set(o.noticeId, {
          noticeId: o.noticeId,
          title: o.title,
          solicitationNumber: o.solicitationNumber,
          agency: o.fullParentPathName,
          type: o.type,
          postedDate: o.postedDate,
          responseDeadLine: o.responseDeadLine,
          naicsCode: o.naicsCode,
          setAside: o.typeOfSetAsideDescription || o.typeOfSetAside || null,
          state: o.officeAddress && o.officeAddress.state,
          link: o.uiLink,
        });
      }
    } catch (e) {
      errors.push({ ncode, error: "fetch_failed" });
    }
  }

  const failed = errors.length >= NAICS.length;
  const opportunities = [...seen.values()].sort((a, b) => (b.postedDate || "").localeCompare(a.postedDate || ""));
  return new Response(
    JSON.stringify({
      ok: errors.length < NAICS.length,
      source: "SAM.gov Opportunities API",
      naics: NAICS,
      window: { from: fmt(from), to: fmt(to) },
      generatedAt: new Date().toISOString(),
      count: opportunities.length,
      errors,
      opportunities,
    }),
    {
      status: failed ? 502 : 200,
      headers: failed ? { ...headers, "Cache-Control": "no-store", "Netlify-CDN-Cache-Control": "no-store" } : headers,
    }
  );
};

export const config = { path: "/api/sam-opportunities" };
