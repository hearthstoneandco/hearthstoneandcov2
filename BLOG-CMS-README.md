# Blog: how it works and how to publish

**Routes** (all rendered by `netlify/functions/blog.mjs`, no per-post HTML files):

| URL | What |
|---|---|
| `/blog` | Newest-first index (12 per page, `/blog/page/2`) |
| `/blog/<slug>` | Post |
| `/blog/category/<slug>` | Category archive |
| `/blog/feed.xml` | RSS |
| `/sitemap-blog.xml` | Sitemap of blog URLs (listed in robots.txt; new posts appear automatically) |

**Content** lives in the repo: `content/blog/<slug>.md` (YAML front matter + body) and `content/blog-categories.yml`.
A post is live when `draft: false` and `date` is today or earlier. Page shell (head/CSS, nav, footer) is in
`netlify/blog-templates/` (copied from the site pages; update there if the site nav/footer changes).

## Publishing without a developer
1. **CMS (recommended):** `/admin` (Decap CMS). Save = draft pull request; Publish = merge to `main`, Netlify redeploys
   (about a minute) and the post renders at `/blog/<slug>`. Requires one-time setup below.
2. **Git:** add a `.md` file to `content/blog/` and merge. Same result.

## One-time CMS setup (founder, Netlify dashboard)
1. Site configuration > Identity > Enable Identity (registration: **Invite only**).
2. Identity > Services > Git Gateway > Enable (grants the CMS write access to the repo through Netlify).
3. Identity > Invite users (your email). Accept the invite, then sign in at `/admin`.

## Post rules (from CLAUDE.md)
Verified claims only; no dollar pay/bill rates for clinician roles; "placement target", never "guarantee"; unique
SEO title and meta description per post; FAQ schema only if the same Q&A is visible in the body; cite primary sources.
