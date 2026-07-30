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
  or certifications. Verified claims only: SBA-Certified VOSB & WOSB; SAM.gov
  UEI SVAZQG49VUH7; CAGE 1ZPE9; NAICS 561320/561311; RN/LVN/CNA staffing;
  W-2 employment model; Katy TX / Greater Houston; founder Renaye Mullings,
  U.S. Army veteran.
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
