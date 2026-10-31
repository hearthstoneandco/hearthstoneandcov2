# CLAUDE.md — Hearthstone & Co. Website Operating Charter

This repo is the production website for Hearthstone & Co. Workforce Solutions LLC
(hearthstoneandco.com) — SBA-certified VOSB & WOSB healthcare staffing, Katy TX,
serving Greater Houston. Static HTML, no build step. Netlify deploys the repo
root on every push to the default branch. Treat every merge as a production
deployment.

## Mission
Generate qualified inquiries from healthcare facilities, government/prime
partners, and clinicians. Optimize for conversions and trust, not vanity traffic.

## Hard rules (never break)
- NEVER invent testimonials, reviews, ratings, awards, client names, placement
  stats, fill rates, response times, bench size, past performance, insurance,
  or certifications. Verified claims only: SBA-Certified VOSB & WOSB; NaVOBA-certified
  Veteran's Business Enterprise (VBE), certificate 202600352V, valid Oct 20, 2026 to Oct 20, 2029; SAM.gov
  UEI SVAZQG49VUH7; CAGE 1ZPE9; NAICS 561320/561311; RN/LVN/CNA staffing;
  POSITIONING (founder, Oct 23, 2026, permanent): Hearthstone hires and staffs allied healthcare and all
  types of medical staffing, but primarily staffs RNs, LVNs and CNAs as the core. Always lead with RN/LVN/CNA
  as core and mention allied/other medical staffing as available; never imply nursing-only or allied-first.
  Also verified: W-2 employment model; Katy TX / Greater Houston; founder Renaye Mullings,
  U.S. Army veteran.
  Also founder-verified (Oct 21, 2026): "Texas Women Veterans Registry | City of Houston" listing; Texas VetHUB
  Certification (applying; founder Oct 27, 2026: program is now VetHUB) and SBA SDVOSB certification (in progress, NOT yet certified; never claim SDVOSB until issued); "A subsidiary of The Shiylohe Collective".
  Also founder-verified (Oct 24, 2026): benefits after 90 days (PTO, paid holidays, group medical/dental/vision with company
  contribution, 401(k)); W-2 clinicians covered by Hearthstone workers' comp ("Zero Employment Risk" wording on
  assisted-living-staffing-houston is verified); background screening via Checkr and FACIS Level 3, Quest drug screening,
  five-step credentialing, monthly OIG/SAM exclusion checks; "competitive rates" and dedicated recruiter support; available
  contracts: 13-week standard, 1-2 week activation, full credentialing managed by Hearthstone, 48h emergency response SLA,
  100% credential verified (travel-nurse-staffing); "we aim to fill any role within 36-72 hours after a facility requests a
  shift" (still a target, never a guarantee); EEO line "Hearthstone & Co. is an equal opportunity employer." (counsel to
  confirm wording); do NOT use "pre-credentialed", "active bench" or "rapid response" on the site
  (banned by the agent charter, issue #51). Use instead: "credentialing managed by Hearthstone" and "36-72 hour placement target".
  PAY RULE (founder, Oct 24, 2026, permanent; applies to ALL AI agents and every website, ad, post, email and job listing):
  (1) CLINICIAN roles (RN, LVN, CNA, allied and any other clinician/staffed role): NEVER publish dollar pay rates, bill rates or
  salary figures; say "competitive rates". (2) INTERNAL roles (people who work for Hearthstone's own internal team, e.g. BDR,
  recruiter, credentialing, admin): DISPLAY the pay rate for every available role; if the founder has not supplied the figure, mark it
  "FOUNDER VERIFICATION REQUIRED" and never invent one. Third-party market data in blogs must cite a fetched primary source, and must
  contain no dollar pay or bill rates.
  RESPONSE-TIME STANDARD (founder, Oct 31, 2026, permanent; applies to ALL AI agents and every page, form, email, ad and post):
  (1) RESPONSE: Hearthstone responds to every facility staffing request, teaming inquiry and BD inquiry within 24-48 hours to begin
  reviewing the request. The founder has approved stating this response time as a commitment. (2) FILL GOAL: the goal is to fill the
  role within 36-72 hours after the INITIAL request; this stays a "placement target", never a guarantee of a fill. Always measure
  from the initial request; never say "after your request is confirmed" or "from a confirmed request". The facility confirmation
  emails in netlify/functions/submission-created.mjs use the same 24-48 hour wording; keep all copy consistent with it.
  Pay cycle: clinicians weekly, internal roles biweekly. Hours of operation follow the Google Business Profile.
  Emails: hello@ general; careers@ internal careers; clinicians@ clinicians; facilities@ facility staffing requests.
  One phone number only: (713) 938-3989. Say "placement target", not "guarantee".
- Anything unverifiable → mark "FOUNDER VERIFICATION REQUIRED" and leave out.
- No keyword stuffing, hidden text, doorway pages, fake schema (especially
  AggregateRating/Review), fake locations, or bought links.
- Never commit secrets. Never change domain/DNS, legal pages, or pricing
  without explicit founder approval.
- Do not remove or alter the /certifications page, capability statement links,
  or the 11 outbound authority links (sba.gov, sam.gov, va.gov, census.gov,
  bon.texas.gov, oig.hhs.gov, jointcommission.org, medicare.gov, twc.texas.gov,
  wbenc.org) without approval.

## Workflow (every change)
1. Branch: `claude/seo-YYYY-MM-DD-short-description` — never work on default.
2. One logical change set per branch/PR. Small, reviewable diffs.
3. Static site checks before PR: all internal links resolve; every changed page
   has unique title + meta description + canonical; images have honest alt text;
   sitemap.xml consistent with real pages; no broken HTML.
4. PR body must include: purpose, files changed, issue addressed, expected
   impact, risks, rollback (revert PR), founder decisions required.
5. NEVER merge to the default branch yourself. Founder merges after reviewing
   the Netlify Deploy Preview.

## Autonomy levels
- Free: read, audit, draft, branch, open PRs for technical fixes (links,
  metadata, alt text, sitemap, accessibility, performance, internal linking).
- Founder approval required BEFORE merge: new pages, homepage changes,
  any business-claim wording, forms, analytics, dependencies.
- Founder approval required BEFORE even implementing: deletions of sections,
  redirects of established URLs, legal/privacy text, anything in Hard Rules.

## Site conventions
- Palette: green #1A3D2E, gold #C9A84C. Fonts: Cormorant Garamond (display),
  DM Sans (body), Space Mono (labels).
- Clean URLs via _redirects (page.html → /page). New pages: add to sitemap.xml,
  _redirects, and the footer "Company" nav where appropriate.
- Primary CTA: "Request Staffing" (request-staffing.html) + Calendly link.
  Audience-split journeys: facilities vs clinicians vs government partners.
