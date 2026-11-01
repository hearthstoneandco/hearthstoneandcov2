# Hearthstone & Co. Brand Guidelines (DRAFT v1.1, 2026-10-31)

Status: draft for founder review. Source of truth for wording is /CLAUDE.md (Hard Rules). Items marked FOUNDER DECISION are open. This file contains no internal audit notes and only verified claims, because the repo root is published by Netlify.

## 1. Who we are
Hearthstone & Co. Workforce Solutions LLC, Katy, Texas, serving Greater Houston. Founder: Renaye Mullings, U.S. Army veteran. A subsidiary of The Shiylohe Collective. Slogan: **Built for the Floor. Ready for Scale.**

Positioning: we hire and staff allied healthcare and all types of medical staffing, with RNs, LVNs and CNAs as the core. Always lead with RN/LVN/CNA; mention allied and other medical staffing as available. Never imply nursing-only or allied-first.

## 2. Verified facts allowed in brand copy
- SBA-certified VOSB and WOSB
- NaVOBA-certified Veteran's Business Enterprise (VBE), certificate 202600352V, valid Oct 20, 2026 to Oct 20, 2029
- SAM.gov UEI SVAZQG49VUH7; CAGE 1ZPE9; NAICS 561320 / 561311
- W-2 employment model; weekly clinician pay; benefits after 90 days
- Background screening via Checkr and FACIS Level 3, Quest drug screening, five-step credentialing, monthly OIG/SAM exclusion checks
- "Credentialing managed by Hearthstone"; "we respond within 24-48 hours" (founder-approved commitment, Oct 31 2026); "36-72 hour placement target" measured from the initial request (a target, never a guarantee)
- Black-owned (founder-verified Nov 1, 2026): usable alongside veteran-owned and woman-owned; no certification or badge may be claimed for it unless the founder supplies one
- Texas Women Veterans Registry (City of Houston) listing; Texas VetHUB certification is "applying"; SBA SDVOSB is in progress and must NOT be claimed
- One phone: (713) 938-3989. Emails: hello@, careers@, clinicians@, facilities@ hearthstoneandco.com

Never use: "pre-credentialed", "active bench", "rapid response", "same-day", "guarantee", invented stats, testimonials, client names, awards, or insurance claims. Clinician roles: never show dollar pay or bill rates ("competitive rates"). Internal roles show the pay rate or "FOUNDER VERIFICATION REQUIRED".

## 3. Brand pillars
1. Veteran-led. 2. Woman-owned. 3. Floor-ready (screening and credentialing steps above). 4. Scalable (allied and other medical staffing available; no capacity or bench numbers).

## 4. Audiences and voice
Shared voice: direct, plain, mission-minded. Short declaratives, then one explanatory sentence. Military metaphor sparingly. No hype.

| Audience | Tone | Lead with | Avoid |
|---|---|---|---|
| Facility buyers | Confident, practical, partner not vendor | RN/LVN/CNA, credentialing managed by Hearthstone, "we respond within 24-48 hours", placement target (from the initial request) | guarantees, "within one business day", "after your request is confirmed", pool or bench numbers |
| Clinicians | Warm, respectful, specific | W-2, weekly pay, benefits after 90 days, competitive rates | dollar pay figures, guaranteed hours |
| Government / prime partners | Formal, precise, credential-first | Certificates, UEI, CAGE, NAICS, teaming language | past performance, clients, SDVOSB, HUB-certified |

Primary CTA: Request Staffing (request-staffing.html) plus Calendly. Clinicians: Join Our Network. EEO line (counsel to confirm): "Hearthstone & Co. is an equal opportunity employer."

## 5. Boilerplate
- **25 words:** Hearthstone & Co. is a veteran-led, woman-owned, Black-owned healthcare staffing company in Katy, Texas, providing RN, LVN and CNA staffing across Greater Houston.
- **50 words:** Hearthstone & Co. Workforce Solutions is a veteran-owned, woman-owned and Black-owned healthcare staffing company in Katy, Texas, founded by U.S. Army veteran Renaye Mullings. We staff RNs, LVNs and CNAs for Greater Houston facilities, with credentialing managed by Hearthstone, and also staff allied and other medical roles as available.
- **100 words:** see issue #117 section 2 (kept in sync with the Proposals boilerplate library, #105).

## 6. Color
| Token | Hex | Use |
|---|---|---|
| Green (emerald) | #1A3D2E | Primary brand, backgrounds, text on light |
| Gold | #C9A84C | Accent. On green or as decorative rule only; never text on white |
| Gold light | #E2C87A | Accent text on green |
| Green mid | #2A5C45 | Secondary surfaces |
| Green light | #3A7A5C | Large text / icons on white |
| Off-white | #F9F9F7 | Light background |
| Ink | #1E1E1E | Body text |
| Text 2 | #4A4A4A | Secondary text |

Contrast (WCAG 2.x, computed; AA normal text needs 4.5, large text and UI 3.0):
- Safe: white / off-white / Em-pale on green (11.99 / 11.38 / 10.53); gold-light on green 7.30 (preferred small gold text); gold on green 5.25 (16px and up); gold on ink 7.29; green on white 11.99; green on gold 5.25; ink on white 16.67; text-2 on white 8.86; tertiary grey #6B6B69 on white / off-white / light grey / Em-pale 5.34 / 5.07 / 4.80 / 4.69.
- Large text or UI only: gold on Green-mid 3.38; Green-light on Em-pale 4.48 (use Green-light on white or off-white only).
- Never: gold on white 2.29; gold on light grey 1.81; Green-light on green 2.35; old tertiary grey #787876 on white 4.42 (fails AA).
- Gold is for green or ink backgrounds and for decorative rules. On light backgrounds use green for text.
- Semantic status colors (info blue, warning amber, error red) are for UI states only, never brand surfaces. FOUNDER DECISION: document them as official tokens.
- FOUNDER DECISION: single green is #1A3D2E; retire #0F3D2A.

## 7. Typography
Cormorant Garamond (display): headings use weight 600, numerals and stats 700, italic as an accent. This is what the live site does; the lighter 300/400 look in the April Canva kit is not loaded on the site. FOUNDER DECISION: confirm 600 for headings. DM Sans (body and UI; 300/400/500/600; tracked uppercase for labels). Space Mono is declared on two pages but not loaded anywhere; FOUNDER DECISION whether it stays.

Heading scale (as built): H1 clamp(2.4rem, 5vw, 3.8rem); H2 clamp(1.9rem, 3.5vw, 2.8rem); H3 clamp(1.2rem, 2vw, 1.6rem); line-height 1.1 to 1.15 for display, 1.6 to 1.7 for body. Smallest readable text: 0.75rem (12px); avoid sizes below it. Preferred small-text steps: 0.75, 0.875, 1, 1.125 rem. Load one canonical Google Fonts link per page.

Radius and shadow tokens: --rad 5px, --rad-md 10px, --rad-lg 16px, pills 100px; shadows neutral black (--sh-sm, --sh-md, --sh-lg). Use the tokens, not hard-coded values.

## 8. Logo
Current asset: logo.png, a gold serif italic "H" in a double gold frame on green (512x512). Clear space: height of the "H" on all sides. Minimum size: 24 px digital, 0.5 in print. Do not recolor, stretch, rotate, add effects, or place on busy photos. Do not place the mark on photos, on gold, or inside another badge, and do not set the company name in a different font beside it. Light-background, mono and horizontal variants, and vector masters: FOUNDER to supply originals; logo changes are founder-only. Never place the mark beside agency marks in a way that implies endorsement.

Third-party marks: use the NaVOBA VBE badge only as supplied. No SBA, VA or other agency logos unless the issuing body allows it and the founder supplies the artwork.

## 9. Photography and imagery
Real people only: founder, real clinicians with consent, real facilities. No stock "clinicians" posed as staff, no AI-generated people presented as staff. Treatment: natural light, warm neutral grade, 4:5 crops for social, no patient faces or readable charts (PHI), green duotone for backgrounds only and never over faces. Alt text must be honest and descriptive and never claims a role the person does not hold. Open Graph images: branded 1200x630 template per audience (proposed; founder approval).

## 10. Templates (Canva, free tier)
19 template briefs (social, carousel, pin, GBP post, OG image, one-pagers, capability cover, letterhead, proposal cover, business card, email signature, deck) are tracked in issue #117 section 4. Locked fields: CTA, cert numbers, contact line, "placement target" disclaimer. Footer on external pieces: (713) 938-3989 | hearthstoneandco.com.

## 11. Open founder decisions
Logo vectors and variants; keep or drop Space Mono; unify the 13 off-token pages to the brand tokens; confirm contact details on legacy Canva kit items; which taglines are primary versus the slogan.

## 12. Icons and charts
Icons: line style, 1.5px stroke, rounded caps, one color (green on light; gold-light or white on green), 24px grid; no medical-cross or stethoscope clip art, no emoji as icons. Charts: series colors in order #1A3D2E, #3A7A5C, #C9A84C (on dark only or with a label), #4A4A4A, #A7B5AD; at most 4 series; direct labels; gridlines #E5E5E1; every statistic carries a source and date; only cited primary data, never bench, fill-rate, response-time or placement figures.
