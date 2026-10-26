// Hearthstone & Co. — blog renderer (Netlify Function v2)
//
// Serves, from content files committed to the repo (edited through the Decap CMS at /admin
// or directly in git — no developer rebuild of pages needed):
//   /blog                       newest-first index (paginated: /blog/page/2)
//   /blog/category/:slug        category archive
//   /blog/:slug                 post
//   /blog/feed.xml              RSS feed
//   /sitemap-blog.xml           sitemap of the blog URLs
//
// Content:  content/blog/<slug>.md  (YAML front matter + HTML or Markdown body)
//           content/blog-categories.yml  (category slug -> name + description)
// Shell:    netlify/blog-templates/{head,nav,footer}.html  (copied from the site pages)
//
// Posts with `draft: true` or a future `date` are not rendered, listed or put in the sitemap.

import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import YAML from "yaml";

const SITE = "https://hearthstoneandco.com";
const PER_PAGE = 12;
const CALENDLY = "https://calendly.com/renaye-hearthstoneandco/20min";
const RESERVED = new Set(["category", "page", "feed.xml"]);

export const config = {
  path: ["/blog", "/blog/", "/blog/*", "/sitemap-blog.xml"],
};

// ---------- file helpers ----------
function findDir(rel) {
  const roots = [process.env.LAMBDA_TASK_ROOT, process.cwd(), path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..")].filter(Boolean);
  for (const r of roots) {
    const p = path.join(r, rel);
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Missing bundled path: " + rel);
}
const read = (rel) => fs.readFileSync(findDir(rel), "utf8");

// ---------- escaping & formatting ----------
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonLd = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const day = (v) => String(v instanceof Date ? v.toISOString() : v ?? "").slice(0, 10);
const longDate = (v) => {
  const [y, m, d] = day(v).split("-").map(Number);
  return y ? `${MONTHS[m - 1]} ${d}, ${y}` : "";
};
const clip = (t, n = 155) => (t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");
const todayUTC = () => new Date().toISOString().slice(0, 10);
const titleCase = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const stripTags = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// ---------- content ----------
function parsePost(file) {
  const raw = read(path.join("content/blog", file)).replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  let fm;
  try { fm = YAML.parse(m[1]) || {}; } catch { return null; }
  const slug = file.replace(/\.md$/, "");
  const body = m[2].trim();
  const html = body.startsWith("<") ? body : marked.parse(body, { gfm: true });
  const cats = (Array.isArray(fm.categories) ? fm.categories : fm.categories ? [fm.categories] : []).map(String);
  const words = stripTags(html).split(" ").filter(Boolean).length;
  return {
    slug,
    title: String(fm.title || titleCase(slug)),
    seoTitle: fm.seo_title ? String(fm.seo_title) : `${fm.title || titleCase(slug)} | Hearthstone & Co.`,
    description: String(fm.description || fm.excerpt || ""),
    excerpt: String(fm.excerpt || fm.description || ""),
    date: day(fm.date),
    updated: day(fm.updated) || day(fm.date),
    author: String(fm.author || "Hearthstone & Co. Workforce Solutions"),
    categories: cats,
    readTime: Number(fm.read_time) || Math.max(1, Math.round(words / 200)),
    image: fm.image ? String(fm.image) : "",
    faq: Array.isArray(fm.faq) ? fm.faq.filter((f) => f && f.question && f.answer) : [],
    draft: fm.draft === true,
    html,
  };
}

function loadPosts() {
  const dir = findDir("content/blog");
  const today = todayUTC();
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(parsePost)
    .filter((p) => p && !p.draft && p.date && p.date <= today)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

function loadCategories(posts) {
  let list = [];
  try { list = YAML.parse(read("content/blog-categories.yml"))?.categories || []; } catch { /* optional */ }
  const map = new Map(list.map((c) => [c.slug, { slug: c.slug, name: c.name || titleCase(c.slug), description: c.description || "" }]));
  for (const p of posts) for (const s of p.categories) if (!map.has(s)) map.set(s, { slug: s, name: titleCase(s), description: "" });
  const counts = {};
  for (const p of posts) for (const s of p.categories) counts[s] = (counts[s] || 0) + 1;
  return [...map.values()].filter((c) => counts[c.slug]).map((c) => ({ ...c, count: counts[c.slug] }));
}

// ---------- page shell ----------
let shellCache;
function shell() {
  return (shellCache ||= {
    head: read("netlify/blog-templates/head.html"),
    nav: read("netlify/blog-templates/nav.html"),
    footer: read("netlify/blog-templates/footer.html"),
  });
}

const BLOG_CSS = `
.blog-hero{background:#1a3050;background-image:linear-gradient(135deg,#1a3050 0%,#06120a 100%);padding:4.5rem 0 3rem;margin-top:70px}
.blog-hero h1{color:#fff;line-height:1.2;margin-bottom:1rem;max-width:900px}
.blog-hero .eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:.75rem}
.blog-hero .dek{color:rgba(255,255,255,.78);font-size:1.08rem;line-height:1.75;max-width:760px;margin-bottom:1.5rem}
.blog-meta{display:flex;align-items:center;gap:.9rem;flex-wrap:wrap;font-size:.84rem;color:rgba(255,255,255,.62)}
.blog-meta .dot{color:rgba(255,255,255,.3)}
.tag{display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.28rem .7rem;border-radius:99px;background:var(--em-pale);color:var(--em);border:1px solid rgba(26,61,46,.15);text-decoration:none}
.tag:hover{background:var(--em);color:#fff}
.tag.on{background:var(--em);color:#fff}
.blog-hero .tag{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.25)}
.blog-hero .tag:hover{background:var(--gold);border-color:var(--gold)}
.blog-hero .tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem}
.blog-wrap{background:var(--off-white);padding:2.5rem 0 4.5rem}
.blog-filter{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:2rem}
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem}
.blog-card{background:#fff;border:1px solid var(--gray-md);border-radius:var(--rad-md);padding:1.75rem;box-shadow:var(--sh-sm);display:flex;flex-direction:column;gap:.75rem;transition:var(--t)}
.blog-card:hover{box-shadow:var(--sh-md);transform:translateY(-2px)}
.blog-card h2{font-family:"Cormorant Garamond",serif;font-size:1.5rem;line-height:1.25;color:var(--em);margin:0}
.blog-card h2 a{color:inherit}
.blog-card p{font-size:.93rem;line-height:1.7;color:var(--text-2);margin:0;flex:1}
.blog-card .card-meta{font-size:.8rem;color:var(--text-3)}
.blog-card .tags{display:flex;gap:.4rem;flex-wrap:wrap}
.blog-card .more{font-size:.84rem;font-weight:600;color:var(--em)}
.pager{display:flex;justify-content:center;gap:1rem;margin-top:2.5rem;font-weight:600}
.pager a{padding:.55rem 1.1rem;border:1px solid var(--em);border-radius:var(--rad);color:var(--em)}
.pager a:hover{background:var(--em);color:#fff}
.post-wrap{background:var(--off-white);padding:0 0 4rem}
.post-body{max-width:900px;margin:-1.25rem auto 0;background:#fff;border-radius:var(--rad-md);padding:2.75rem 3rem;box-shadow:var(--sh-sm);border:1px solid var(--gray-md);position:relative}
.post-body a{color:var(--em);text-decoration:underline;text-underline-offset:2px}
.post-body a.btn{text-decoration:none}
.post-body a.btn-gold,.post-body a.btn-primary{color:#fff}
.post-body img{border-radius:var(--rad);margin:1.5rem 0;height:auto}
.post-body ol{margin:0 0 1.25rem 1.5rem}
.post-body ol li{font-size:.97rem;line-height:1.85;color:var(--text-2);margin-bottom:.5rem}
.post-body blockquote{margin:0 0 1.25rem;padding:.25rem 0 .25rem 1.25rem;border-left:4px solid var(--gold);color:var(--text-2)}
.post-body table{border-collapse:collapse;width:100%;margin:0 0 1.5rem;font-size:.93rem}
.post-body th,.post-body td{border:1px solid var(--gray-md);padding:.6rem .8rem;text-align:left}
.post-body th{background:var(--em-pale);color:var(--em)}
.post-cta{max-width:900px;margin:1.5rem auto 0;background:var(--em);border-radius:var(--rad-md);padding:2rem 2.25rem;display:flex;gap:1.5rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
.post-cta h2{color:#fff;font-family:"Cormorant Garamond",serif;font-size:1.6rem;margin:0 0 .35rem}
.post-cta p{color:rgba(255,255,255,.78);font-size:.93rem;margin:0;max-width:520px;line-height:1.65}
.post-cta .btns{display:flex;gap:.75rem;flex-wrap:wrap}
.post-cta .btn-outline-w{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}
.post-cta .btn-outline-w:hover{background:#fff;color:var(--em)}
.post-foot{max-width:900px;margin:1.5rem auto 0;padding:1.25rem 1.5rem;background:#fff;border-radius:var(--rad-md);border:1px solid var(--gray-md);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.post-foot p{font-size:.8rem;color:var(--text-3);font-style:italic;margin:0;flex:1;min-width:260px}
.post-foot a{font-size:.83rem;font-weight:600;color:var(--em);white-space:nowrap}
.related{max-width:900px;margin:2.5rem auto 0}
.related h2{font-family:"Cormorant Garamond",serif;font-size:1.6rem;color:var(--em);margin-bottom:1rem}
.related .blog-grid{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.related .blog-card h3{font-family:"Cormorant Garamond",serif;font-size:1.25rem;line-height:1.25;color:var(--em);margin:0}
.related .blog-card h3 a{color:inherit}
.article-body h2,.post-body h2{font-family:"Cormorant Garamond",serif;font-size:1.65rem;color:var(--em);margin:2.25rem 0 .75rem;padding-top:1.5rem;border-top:1px solid var(--gray-md)}
.post-body>h2:first-child,.post-body>.lead+h2{border-top:none;padding-top:0}
.post-body h3{font-family:"DM Sans",sans-serif;font-size:1rem;font-weight:700;color:var(--ch);margin:1.75rem 0 .5rem}
.post-body p{margin-bottom:1.25rem;font-size:.97rem;line-height:1.85;color:var(--text-2)}
.post-body .lead{max-width:none;font-size:1.06rem;color:var(--text-1);line-height:1.9;font-style:italic;margin-bottom:2rem;padding:1.25rem 1.5rem;background:var(--em-pale);border-left:4px solid var(--gold);border-radius:0 var(--rad) var(--rad) 0}
.post-body ul{margin:0 0 1.25rem 1.5rem;padding:0;list-style:disc}
.post-body ul li{font-size:.97rem;line-height:1.85;color:var(--text-2);margin-bottom:.5rem}
.post-body .stat-callout{background:var(--em);color:#fff;border-radius:var(--rad-md);padding:1.5rem 1.75rem;margin:2rem 0;display:flex;gap:1.25rem;align-items:center}
.post-body .stat-callout .stat-num{font-family:"Cormorant Garamond",serif;font-size:2.8rem;font-weight:700;color:var(--gold);line-height:1;flex-shrink:0}
.post-body .stat-callout .stat-label{font-size:.87rem;color:rgba(255,255,255,.82);line-height:1.6}
.post-body .btn-group{display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0}
@media(max-width:720px){.post-body{padding:1.75rem 1.25rem;margin-top:-.75rem}.post-cta{padding:1.5rem}.blog-grid{grid-template-columns:1fr}.blog-hero{padding:3.5rem 0 2.25rem}}
`;

function page({ title, description, canonical, ogType = "website", image, ld = [], body, noindex = false }) {
  const s = shell();
  const img = image || `${SITE}/hero-founder.jpg`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : ""}
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(img)}">
<link rel="alternate" type="application/rss+xml" title="Hearthstone &amp; Co. Blog" href="${SITE}/blog/feed.xml">
${s.head.replace(/<meta (property|name)="(og|twitter):image"[^>]*>\s*/g, "")}
<style>${BLOG_CSS}</style>
${ld.map((o) => `<script type="application/ld+json">${jsonLd(o)}</script>`).join("\n")}
</head>
<body>
${s.nav}
<main>
${body}
</main>
${s.footer}
</body>
</html>`;
}

const crumbLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })),
});

const tagLinks = (post, cats) =>
  post.categories
    .map((s) => `<a class="tag" href="/blog/category/${esc(s)}">${esc(cats.find((c) => c.slug === s)?.name || titleCase(s))}</a>`)
    .join("");

function card(post, cats, h = "h2") {
  return `<article class="blog-card">
  <div class="tags">${tagLinks(post, cats)}</div>
  <${h}><a href="/blog/${esc(post.slug)}">${esc(post.title)}</a></${h}>
  <p>${esc(post.excerpt)}</p>
  <div class="card-meta"><time datetime="${esc(post.date)}">${esc(longDate(post.date))}</time> · ${post.readTime} min read</div>
  <a class="more" href="/blog/${esc(post.slug)}">Read article →</a>
</article>`;
}

// ---------- views ----------
function listView({ posts, cats, cat, pageNum }) {
  const list = cat ? posts.filter((p) => p.categories.includes(cat.slug)) : posts;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const slice = list.slice((pageNum - 1) * PER_PAGE, pageNum * PER_PAGE);
  const base = cat ? `/blog/category/${cat.slug}` : "/blog";
  const url = (n) => (n === 1 ? base : `${base}/page/${n}`);
  const h1 = cat ? cat.name : "Healthcare Staffing Insights for Houston";
  const dek = cat
    ? cat.description
    : "Practical guidance on licensure, compliance, per diem and contract staffing, and workforce trends for Houston-area facilities and clinicians.";
  const canonical = SITE + url(pageNum);
  const titleBase = cat ? `${cat.name} Articles | Hearthstone & Co. Blog` : "Healthcare Staffing Blog | Hearthstone & Co.";
  const title = pageNum > 1 ? `${titleBase.replace(" | ", ` (Page ${pageNum}) | `)}` : titleBase;
  const description = cat
    ? clip(cat.description || `${cat.name} articles from Hearthstone & Co. Workforce Solutions.`)
    : "Healthcare staffing articles for Houston facilities and clinicians: Texas licensure verification, OIG/SAM screening, CMS staffing rules, per diem vs. contract, and workforce trends.";
  const chips = [`<a class="tag${cat ? "" : " on"}" href="/blog">All</a>`]
    .concat(cats.map((c) => `<a class="tag${cat && cat.slug === c.slug ? " on" : ""}" href="/blog/category/${esc(c.slug)}">${esc(c.name)} (${c.count})</a>`))
    .join("");
  const crumbs = [["Home", SITE + "/"], ["Blog", SITE + "/blog"]].concat(cat ? [[cat.name, SITE + base]] : []);
  const body = `
<section class="blog-hero"><div class="container">
  <div class="breadcrumb"><a href="/">Home</a><span class="bc-sep">/</span>${cat ? `<a href="/blog">Blog</a><span class="bc-sep">/</span>${esc(cat.name)}` : "Blog"}</div>
  <span class="eyebrow">${cat ? "Category" : "Hearthstone &amp; Co. Blog"}</span>
  <h1>${esc(h1)}</h1>
  <p class="dek">${esc(dek)}</p>
</div></section>
<section class="blog-wrap"><div class="container">
  <nav class="blog-filter" aria-label="Blog categories">${chips}</nav>
  <div class="blog-grid">${slice.map((p) => card(p, cats)).join("\n")}</div>
  ${pages > 1 ? `<div class="pager">${pageNum > 1 ? `<a rel="prev" href="${url(pageNum - 1)}">← Newer</a>` : ""}${pageNum < pages ? `<a rel="next" href="${url(pageNum + 1)}">Older →</a>` : ""}</div>` : ""}
</div></section>`;
  return page({
    title, description, canonical, body,
    ld: [
      crumbLd(crumbs),
      { "@context": "https://schema.org", "@type": "CollectionPage", name: h1, url: canonical, description,
        mainEntity: { "@type": "ItemList", itemListElement: slice.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/blog/${p.slug}`, name: p.title })) } },
    ],
  });
}

function postView({ post, posts, cats }) {
  const url = `${SITE}/blog/${post.slug}`;
  const primary = cats.find((c) => c.slug === post.categories[0]);
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: p.categories.filter((c) => post.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, 3)
    .map((x) => x.p);
  const crumbs = [["Home", SITE + "/"], ["Blog", SITE + "/blog"]]
    .concat(primary ? [[primary.name, `${SITE}/blog/category/${primary.slug}`]] : [])
    .concat([[post.title, url]]);
  const ld = [
    {
      "@context": "https://schema.org", "@type": "BlogPosting",
      headline: post.title, description: post.description, url,
      mainEntityOfPage: url, datePublished: post.date, dateModified: post.updated,
      ...(post.image ? { image: post.image.startsWith("http") ? post.image : SITE + post.image } : {}),
      author: { "@type": "Organization", name: post.author },
      publisher: { "@type": "Organization", name: "Hearthstone & Co. Workforce Solutions LLC", url: SITE },
    },
    crumbLd(crumbs),
  ];
  // FAQ JSON-LD: only valid when the same questions/answers are visible in the post body.
  if (post.faq.length)
    ld.push({ "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) });
  const body = `
<section class="blog-hero"><div class="container">
  <div class="breadcrumb"><a href="/">Home</a><span class="bc-sep">/</span><a href="/blog">Blog</a>${primary ? `<span class="bc-sep">/</span><a href="/blog/category/${esc(primary.slug)}">${esc(primary.name)}</a>` : ""}</div>
  <div class="tags">${tagLinks(post, cats)}</div>
  <h1>${esc(post.title)}</h1>
  <p class="dek">${esc(post.excerpt)}</p>
  <div class="blog-meta">
    <span>By ${esc(post.author)}</span><span class="dot">·</span>
    <time datetime="${esc(post.date)}">${esc(longDate(post.date))}</time><span class="dot">·</span>
    <span>${post.readTime} min read</span>
    ${post.updated && post.updated !== post.date ? `<span class="dot">·</span><span>Updated <time datetime="${esc(post.updated)}">${esc(longDate(post.updated))}</time></span>` : ""}
  </div>
</div></section>
<section class="post-wrap"><div class="container">
  <article class="post-body">
${post.html}
  </article>
  <aside class="post-cta" aria-label="Request staffing">
    <div><h2>Need clinicians for your facility?</h2>
    <p>RN, LVN and CNA staffing for Greater Houston, with credentialing managed by Hearthstone and a 36–72 hour placement target after your request.</p></div>
    <div class="btns"><a href="/request-staffing" class="btn btn-gold">Request Staffing</a><a href="${CALENDLY}" class="btn btn-outline-w" rel="noopener">Book a 20-Minute Call</a></div>
  </aside>
  <div class="post-foot">
    <p>This article is for informational purposes only. It does not constitute legal, compliance, or professional advice. Consult a licensed healthcare attorney or compliance professional for guidance specific to your organization.</p>
    <a href="/blog">← All Articles</a>
  </div>
  ${related.length ? `<section class="related"><h2>Keep reading</h2><div class="blog-grid">${related.map((p) => card(p, cats, "h3")).join("")}</div></section>` : ""}
</div></section>`;
  return page({ title: post.seoTitle, description: post.description, canonical: url, ogType: "article", image: post.image && (post.image.startsWith("http") ? post.image : SITE + post.image), ld, body });
}

function notFoundView() {
  const body = `<section class="blog-hero"><div class="container"><h1>Article not found</h1><p class="dek">That article doesn't exist or hasn't been published yet.</p><a class="btn btn-gold" href="/blog">Browse all articles</a></div></section>`;
  return page({ title: "Article not found | Hearthstone & Co. Blog", description: "This blog article could not be found.", canonical: SITE + "/blog", body, noindex: true });
}

// ---------- feeds ----------
const xml = (s) => esc(s).replace(/'/g, "&apos;");
function sitemapXml(posts, cats) {
  const urls = [[`${SITE}/blog`, posts[0]?.updated || posts[0]?.date]]
    .concat(cats.map((c) => [`${SITE}/blog/category/${c.slug}`, posts.find((p) => p.categories.includes(c.slug))?.updated]))
    .concat(posts.map((p) => [`${SITE}/blog/${p.slug}`, p.updated || p.date]));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(([u, d]) => `  <url><loc>${xml(u)}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`)
    .join("\n")}\n</urlset>\n`;
}
function rssXml(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Hearthstone &amp; Co. Blog</title><link>${SITE}/blog</link><description>Healthcare staffing insights for Houston facilities and clinicians.</description><language>en-us</language>\n${posts
    .slice(0, 30)
    .map((p) => `<item><title>${xml(p.title)}</title><link>${SITE}/blog/${xml(p.slug)}</link><guid isPermaLink="true">${SITE}/blog/${xml(p.slug)}</guid><pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate><description>${xml(p.excerpt)}</description></item>`)
    .join("\n")}\n</channel></rss>\n`;
}

// ---------- handler ----------
const HTML = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "public, max-age=0, must-revalidate",
  // CDN cache is purged on every deploy; the TTL also lets future-dated posts appear on schedule.
  "Netlify-CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export default async (req) => {
  const u = new URL(req.url);
  let p = u.pathname;
  try {
    if (p !== "/" && p.endsWith("/")) return Response.redirect(SITE + p.replace(/\/+$/, ""), 301);

    const posts = loadPosts();
    const cats = loadCategories(posts);

    if (p === "/sitemap-blog.xml")
      return new Response(sitemapXml(posts, cats), { headers: { ...HTML, "Content-Type": "application/xml; charset=utf-8" } });
    if (p === "/blog/feed.xml")
      return new Response(rssXml(posts), { headers: { ...HTML, "Content-Type": "application/rss+xml; charset=utf-8" } });

    const parts = p.replace(/^\/blog\/?/, "").split("/").filter(Boolean);
    const ok = (html) => new Response(html, { headers: HTML });
    const missing = () => new Response(notFoundView(), { status: 404, headers: { ...HTML, "Cache-Control": "public, max-age=0, must-revalidate" } });
    const num = (v) => (/^\d+$/.test(v || "") ? Number(v) : 0);

    if (parts.length === 0) return ok(listView({ posts, cats, pageNum: 1 }));
    if (parts[0] === "page" && parts.length === 2) {
      const n = num(parts[1]);
      if (n === 1) return Response.redirect(SITE + "/blog", 301);
      if (n < 2 || n > Math.ceil(posts.length / PER_PAGE)) return missing();
      return ok(listView({ posts, cats, pageNum: n }));
    }
    if (parts[0] === "category") {
      if (parts.length === 1) return Response.redirect(SITE + "/blog", 301);
      const cat = cats.find((c) => c.slug === parts[1]);
      if (!cat) return missing();
      if (parts.length === 2) return ok(listView({ posts, cats, cat, pageNum: 1 }));
      if (parts[2] === "page" && parts.length === 4) {
        const n = num(parts[3]);
        if (n === 1) return Response.redirect(`${SITE}/blog/category/${cat.slug}`, 301);
        if (n < 2 || n > Math.ceil(cat.count / PER_PAGE)) return missing();
        return ok(listView({ posts, cats, cat, pageNum: n }));
      }
      return missing();
    }
    if (parts.length === 1 && !RESERVED.has(parts[0])) {
      const post = posts.find((x) => x.slug === parts[0]);
      return post ? ok(postView({ post, posts, cats })) : missing();
    }
    return missing();
  } catch (err) {
    console.error("blog function error", err);
    return new Response("Blog temporarily unavailable.", { status: 500, headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } });
  }
};
