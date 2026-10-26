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
   (about a minute) and the post renders at `/blog/<slug>`. Requires the one-time GitHub login setup below.
2. **Git:** add a `.md` file to `content/blog/` and merge. Same result.

## One-time CMS setup (founder)
Netlify Identity / Git Gateway are not used (deprecated for newer sites). The CMS signs in with GitHub through
`netlify/functions/cms-auth.mjs`.
1. GitHub > Settings > Developer settings > OAuth Apps > New OAuth App (use the hearthstoneandco org's settings if the repo is org-owned).
   Homepage URL `https://hearthstoneandco.com`; Authorization callback URL `https://hearthstoneandco.com/oauth/callback`.
2. Copy the Client ID, generate a Client secret.
3. Netlify > Project configuration > Environment variables: add `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`
   (mark the secret as secret; scope: Functions). Never put these in the repo or in chat.
4. Redeploy, open `/admin`, click "Login with GitHub". Anyone who can sign in must have write access to the repo;
   GitHub enforces that, so adding an editor = adding them as a repo collaborator.

## Post rules (from CLAUDE.md)
Verified claims only; no dollar pay/bill rates for clinician roles; "placement target", never "guarantee"; unique
SEO title and meta description per post; FAQ schema only if the same Q&A is visible in the body; cite primary sources.
