# UX audit: above-the-fold clarity and CTA consistency (2026-11-02)

Status: PROPOSAL. Docs only, no live page changed. Everything below that touches a live page is needs:founder.
Method: Playwright/Chromium at 375x812 and 1280x800 on index, request-staffing and apply; DOM read of the CTAs visible in the first viewport. Web fonts did not load in the sandbox, so type metrics are approximate. Impact statements are hypotheses.

## Findings

| ID | Sev | Page | Finding | Recommended fix | Gate |
|---|---|---|---|---|---|
| CTA-1 | High | index | Hero primary button says "Book a Free Demo" and jumps to `#book-demo` far down the page. The site's primary CTA is "Request Staffing" (/request-staffing). Header says Request Staffing, hero says something else, so the first screen shows two different asks. | Make the hero primary "Request Staffing" -> /request-staffing; keep Calendly as the secondary "Book a 20-minute call". | needs:founder (homepage) |
| CTA-2 | High | index | The audience-split panel button reads "Request Staffing" but links to `#book-demo` (anchor to a Calendly section), not to the request form. Label and destination disagree. | Point to /request-staffing, or relabel to "Book a consultation". | needs:founder (homepage) |
| CTA-3 | Med | index | Hero secondary is "Find Nursing Jobs" at the same visual weight as the primary. Clinician path is valid, but at 375px it sits directly under the facility CTA and splits attention. | Demote to a text link or outline button; keep it visible. Audience-split chips below the fold already cover clinicians. | needs:founder |
| CTA-4 | Med | index | Trust chip above the H1 wraps to 3 lines at 375px with an orphan dot at the left edge and pushes the H1 down. | Shorten to "Veteran-owned · Woman-owned · Black-owned" and show certifications (SBA VOSB/WOSB, NaVOBA VBE) in one compact line under the CTAs. All are verified claims. | needs:founder (claim wording) |
| CTA-5 | Med | index | H1 breaks mid-word ("veteran-/owned") at 375px. | `hyphens:manual` plus a non-breaking hyphen (U+2011) or `text-wrap:balance` on the H1. CSS only. | low-risk, can ship after founder OK on homepage edits |
| CTA-6 | Med | request-staffing | Form is reachable only after ~520px of hero on mobile. Hero text is fine but the first screen contains no form field. | Reduce hero padding on <=480px so the first field shows in the first viewport; add a "Prefer to talk? (713) 938-3989" tap-to-call line. | needs:founder (forms) |
| CTA-7 | Low | all pages | No persistent CTA on mobile once the user scrolls past the header; the header CTA scrolls away. About 61% of GSC clicks are mobile. | Sticky bottom bar, see prototype `sticky-mobile-cta.html`. | needs:founder |
| CTA-8 | Info | apply | First screen is a sign-in/create-account portal with no explanation of the W-2 role types (RN/LVN/CNA) or what happens next. | Add a one-line intro above the auth card (copy to be supplied/approved). | needs:founder |

## Sticky mobile CTA proposal

- Shows only below 768px, after the user scrolls past the hero, hides when the on-page form or footer is in view and when the mobile menu is open.
- Two actions: "Request Staffing" (primary, /request-staffing) and a tap-to-call icon button (tel:+17139383989, the single published number). Clinician pages swap the primary to "Apply" using the existing clinician route.
- 56px tall including safe-area inset, 44px minimum tap targets, brand green #1A3D2E with gold #C9A84C focus ring, honors `prefers-reduced-motion`.
- Reserve bottom padding on `body` equal to the bar height so footer links are never covered.
- Risks: covers content at the bottom edge, can double up with the newsletter popup (newsletter-popup.js) and any cookie/consent UI; needs a QA pass on iOS Safari for the dynamic toolbar. Rollback: remove one CSS/JS include.
- Prototype: `docs/ux/sticky-mobile-cta.html` (noindex, not linked, not in sitemap).

## Measurement plan (no analytics changes made)

Judge on GSC mobile CTR/clicks per page and, only if the founder approves events: Request Staffing click by placement (header, hero, sticky, split panel), tap-to-call, Calendly open, form start and submit, clinician application start. Compare 14 days before and after; treat as directional given low volume.

## Coordination

Agent 12 (CRO): CTA-1/2/3 overlap the monthly hypotheses issue #269. Agent 40 (Brand): CTA-4 chip wording. Agent 5 (QA): iOS Safari check for the sticky bar. Agent 17 (Page Speed): the prototype adds under 1 KB CSS and no dependencies.
