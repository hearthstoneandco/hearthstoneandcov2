# Hearthstone & Co. Workforce Solutions — Website

**Version:** 2.0  
**Built for:** Netlify deployment  
**Parent Company:** The Shiylohe Collective (Veteran-Owned)  
**Service Area:** Greater Houston, Texas

---

## Project Structure

```
hearthstone-co-website/
├── index.html                    ← Homepage
├── request-staffing.html         ← Facility lead intake form
├── join-our-network.html         ← Clinician quick apply form
├── clinician-jobs.html           ← Clinician recruiting page
├── healthcare-staffing.html      ← Services overview
├── for-healthcare-facilities.html← Facility-focused page
├── compliance-credentialing.html ← Trust & compliance page
├── why-hearthstone.html          ← Differentiation page
├── industries-served.html        ← Vertical SEO page
├── about.html                    ← Company story
├── contact.html                  ← Contact + contact form
├── resources.html                ← Blog / resource center
├── css/
│   └── main.css                  ← All styles
├── js/
│   └── main.js                   ← Navigation, counters, forms
├── assets/
│   └── images/                   ← Image placeholders (replace with real photos)
├── netlify.toml                  ← Netlify build + header config
├── _redirects                    ← URL redirect rules
└── README.md                     ← This file
```

---

## Deploy to Netlify

### Option A — Drag and Drop (Fastest)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the entire project folder into the Netlify deploy dropzone
3. Site is live instantly

### Option B — Git Integration
1. Push the project to a GitHub, GitLab, or Bitbucket repo
2. In Netlify: **New site → Import from Git**
3. Connect the repo — no build command needed
4. Set **Publish directory** to `/` (root)
5. Deploy

### Option C — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

---

## Customizing the Site

### Update Contact Information
Search and replace across all HTML files:
- `hello@hearthstoneandco.com` → your real email
- `(713) 555-0100` → your real phone number
- `https://hearthstoneandco.com` → your actual domain

### Replace Image Placeholders
All image placeholders are styled `div.img-ph` elements.  
Replace them with actual `<img>` tags:
```html
<!-- Before -->
<div class="img-ph" style="height:440px">[Description]</div>

<!-- After -->
<img src="/assets/images/your-photo.jpg" alt="Hearthstone team" style="height:440px;width:100%;object-fit:cover;border-radius:10px">
```

Recommended image sources: Unsplash, Pexels, or original professional photography.

### Update Logo Client Strip (Trust Strip)
In `index.html`, find `.logo-ph` divs and replace with real `<img>` tags:
```html
<img src="/assets/images/client-logo.svg" alt="Client Name" style="height:36px;opacity:.6">
```

### Edit Testimonials
Search for `.tcard` in each page to update the three testimonials with real client quotes.

### Update Founder/Leadership Section
In `about.html`, find the leadership section and replace:
- `[Founder Name]` with the actual name
- `[Photo]` placeholder div with a real headshot image

---

## Forms (Netlify Forms)

All three forms use **Netlify Forms** and will work automatically on deployment.

| Form Name | File | Netlify Name |
|---|---|---|
| Staffing Request | `request-staffing.html` | `staffing-request` |
| Clinician Application | `join-our-network.html` | `clinician-network` |
| Contact | `contact.html` | `contact` |

### Receiving Form Submissions
1. Go to **Netlify Dashboard → Forms**
2. All submissions appear there automatically
3. Set up email notifications: **Forms → Notifications → Email**

### Form Redirect / Confirmation
The JS in `main.js` handles success states inline (no page redirect).  
To send to a custom thank-you page instead, modify `bindForm()` in `js/main.js`.

---

## SEO

### Meta Tags
Each page has unique `<title>` and `<meta name="description">` tags.  
Update them with your actual domain once live:
```html
<link rel="canonical" href="https://yourdomain.com/page-name.html">
```

### Add Google Analytics
Paste your GA4 script in the `<head>` of each page, or use a shared include method:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Submit Sitemap
1. Create `sitemap.xml` listing all page URLs
2. Submit to Google Search Console at **https://search.google.com/search-console**

---

## Connecting Future Tools

### Calendly (Discovery Call Booking)
Add a Calendly embed or popup to any CTA:
```html
<!-- Inline embed -->
<div class="calendly-inline-widget" data-url="https://calendly.com/yourlink" style="min-width:320px;height:630px;"></div>
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

### HubSpot CRM
Replace Netlify forms with HubSpot forms:
1. Create forms in HubSpot → **Marketing → Forms**
2. Get embed code and replace `<form>` elements
3. All submissions flow into HubSpot CRM automatically

### Airtable (Job Board Backend)
In `resources.html` or a new `job-board.html`:
1. Use Airtable API: `https://api.airtable.com/v0/{baseId}/{tableName}`
2. Fetch job listings with `fetch()` in `js/main.js`
3. Render job cards dynamically

### Supabase (Full Backend)
For recruiter portal and live data:
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Add `@supabase/supabase-js` via CDN
3. Connect to clinician and facility tables
4. Protect the recruiter portal with Supabase Auth

---

## Brand Colors (CSS Variables)

```css
--em: #1a3d2e          /* Deep Emerald — primary brand */
--em-md: #2a5c45       /* Medium Emerald */
--em-lt: #3a7a5c       /* Light Emerald */
--em-pale: #eaf2ee     /* Pale Emerald — backgrounds */
--ch: #1e1e1e          /* Charcoal — dark sections */
--gold: #c9a84c        /* Champagne Gold — accents */
--gold-lt: #e2c87a     /* Light Gold */
```

---

## Fonts

- **Cormorant Garamond** — Display/headings (premium, editorial feel)
- **DM Sans** — Body/UI text (clean, modern, readable)

Both loaded via Google Fonts. For performance, consider self-hosting after launch.

---

## Support

For questions about updating or extending this site:  
Contact: **hello@hearthstoneandco.com**

---

*Built for Hearthstone & Co. Workforce Solutions — A subsidiary of The Shiylohe Collective*
