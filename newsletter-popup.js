/* Hearthstone & Co. - newsletter signup banner.
   A slim, non-blocking banner docked at the bottom of the page. Shown once per visitor
   (re-offered after 45 days if dismissed, never after subscribing). Skipped on form and
   conversion pages. Submits to the Netlify form "newsletter" declared on /newsletter.
   No personal data is sent to analytics. */
(function () {
  var SKIP = /^\/(request-staffing|contact|apply|join-our-network|careers-portal|bd-contact|teaming-inquiry|newsletter|privacy-policy|sms-consent|accessibility|terms-of-service)(\/|\.html)?$/;
  var path = location.pathname.replace(/\/$/, '');
  if (SKIP.test(path) || path.indexOf('/admin') === 0) return;
  var KEY = 'hs_nl', DAYS = 45;
  function get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var st = get();
  if (st && (st.done || (Date.now() - st.t) < DAYS * 864e5)) return;
  function ev(n) { try { if (typeof gtag === 'function') gtag('event', n, { page_path: location.pathname }); } catch (e) {} }

  var css =
    '#hs-nl{position:fixed;left:50%;bottom:16px;z-index:900;width:min(880px,calc(100% - 24px));transform:translate(-50%,24px);opacity:0;visibility:hidden;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .35s,visibility 0s .45s}' +
    '#hs-nl.on{transform:translate(-50%,0);opacity:1;visibility:visible;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .35s}' +
    '#hs-nl .hs-bar{position:relative;display:flex;align-items:center;gap:16px;background:#1A3D2E;color:#fff;border-radius:14px;padding:12px 44px 12px 14px;box-shadow:0 12px 40px rgba(10,25,18,.35),0 0 0 1px rgba(201,168,76,.45);font-family:"DM Sans",system-ui,sans-serif}' +
    '#hs-nl .hs-bar:before{content:"";position:absolute;left:18px;right:18px;top:0;height:2px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);border-radius:2px}' +
    '#hs-nl img.hs-hs-lg{width:46px;height:46px;border-radius:10px;flex:none;box-shadow:0 0 0 1px rgba(201,168,76,.5)}' +
    '#hs-nl .hs-tx{flex:1 1 auto;min-width:0}' +
    '#hs-nl .hs-k{font-family:"Space Mono",monospace;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#C9A84C;margin:0 0 2px}' +
    '#hs-nl .hs-h{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.22rem;line-height:1.15;font-weight:600;margin:0;color:#fff}' +
    '#hs-nl .hs-s{font-size:.78rem;color:rgba(255,255,255,.72);margin:3px 0 0;line-height:1.35}' +
    '#hs-nl form{display:flex;gap:8px;flex:none;align-items:center;margin:0}' +
    '#hs-nl input[type=email]{width:220px;box-sizing:border-box;padding:.62rem .8rem;border:1px solid rgba(255,255,255,.25);border-radius:8px;background:rgba(255,255,255,.96);color:#1A3D2E;font-size:.92rem;font-family:inherit}' +
    '#hs-nl input[type=email]::placeholder{color:#6b7c73}' +
    '#hs-nl button.hs-go{background:#C9A84C;color:#1A3D2E;border:0;border-radius:8px;padding:.62rem 1.05rem;font-size:.9rem;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;transition:background .2s}' +
    '#hs-nl button.hs-go:hover{background:#d8b95e}#hs-nl button.hs-go:disabled{opacity:.7;cursor:default}' +
    '#hs-nl button.hs-x{position:absolute;top:6px;right:8px;width:30px;height:30px;background:none;border:0;border-radius:50%;color:rgba(255,255,255,.7);font-size:1.4rem;line-height:1;cursor:pointer}' +
    '#hs-nl button.hs-x:hover{color:#fff;background:rgba(255,255,255,.1)}' +
    '#hs-nl .hs-fine{font-size:.68rem;color:rgba(255,255,255,.55);margin:5px 0 0}#hs-nl .hs-fine a{color:rgba(255,255,255,.8)}' +
    '#hs-nl .hs-err{font-size:.74rem;color:#f3c9c9;margin:4px 0 0}' +
    '#hs-nl .hs-ok{display:flex;align-items:center;gap:12px;width:100%}#hs-nl .hs-ok[hidden]{display:none}' +
    '#hs-nl :focus-visible{outline:2px solid #C9A84C;outline-offset:2px}' +
    '@media(max-width:720px){#hs-nl{bottom:10px;width:calc(100% - 16px)}#hs-nl .hs-bar{flex-wrap:wrap;gap:10px;padding:12px 40px 12px 12px}' +
    '#hs-nl img.hs-hs-lg{width:38px;height:38px}#hs-nl .hs-h{font-size:1.1rem}#hs-nl .hs-s{display:none}#hs-nl form{width:100%}#hs-nl input[type=email]{flex:1;width:auto;min-width:0}}' +
    '@media(prefers-reduced-motion:reduce){#hs-nl,#hs-nl.on{transition:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var wrap = document.createElement('aside'); wrap.id = 'hs-nl'; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Newsletter signup');
  wrap.innerHTML =
    '<div class="hs-bar"><button type="button" class="hs-x" aria-label="Dismiss newsletter signup">&times;</button>' +
    '<div class="hs-ok" id="hs-nl-ok" hidden role="status"><img class="hs-lg" src="/icon-192.png" alt="" width="46" height="46"><div class="hs-tx"><p class="hs-k">Subscribed</p><p class="hs-h">You are on the list. Thank you.</p></div></div>' +
    '<img class="hs-lg" id="hs-nl-lg" src="/icon-192.png" alt="" width="46" height="46">' +
    '<div class="hs-tx" id="hs-nl-tx"><p class="hs-k">The Hearthstone Brief</p><p class="hs-h">One useful email a month for Houston facility leaders</p>' +
    '<p class="hs-s">Staffing and credentialing know-how and planning checklists. Unsubscribe anytime.</p></div>' +
    '<form name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="hs-nl-form"><input type="hidden" name="form-name" value="newsletter">' +
    '<p hidden><label>Do not fill this out <input name="bot-field"></label></p>' +
    '<label for="hs-nl-e" style="position:absolute;left:-9999px">Work email</label>' +
    '<input id="hs-nl-e" type="email" name="email" required autocomplete="email" placeholder="Work email"><button class="hs-go" type="submit">Subscribe</button></form></div>';
  document.body.appendChild(wrap);

  var shown = false, lastFocus = null;
  function open() { if (shown) return; shown = true; wrap.classList.add('on'); ev('newsletter_banner_view'); }
  function close(done) { wrap.classList.remove('on'); set({ t: Date.now(), done: !!done }); }
  wrap.querySelector('.hs-x').onclick = function () { ev('newsletter_banner_close'); close(false); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('on') && wrap.contains(document.activeElement)) close(false); });
  document.getElementById('hs-nl-form').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target, b = f.querySelector('button.hs-go'), t = b.textContent; b.disabled = true; b.textContent = 'Subscribing...';
    var old = wrap.querySelector('.hs-err'); if (old) old.remove();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
      .then(function (r) { if (!r.ok) throw 0;
        ['hs-nl-lg', 'hs-nl-tx', 'hs-nl-form'].forEach(function (id) { document.getElementById(id).style.display = 'none'; });
        document.getElementById('hs-nl-ok').hidden = false; set({ t: Date.now(), done: true }); ev('newsletter_signup');
        setTimeout(function () { wrap.classList.remove('on'); }, 4000); })
      .catch(function () { b.disabled = false; b.textContent = t; var m = document.createElement('p'); m.className = 'hs-err'; m.setAttribute('role', 'alert'); m.textContent = 'Something went wrong. Please try again or email hello@hearthstoneandco.com.'; wrap.querySelector('.hs-tx').appendChild(m); });
  });

  /* Appears after the visitor has engaged: 20s on page plus 25% scroll (or 45s regardless). */
  var start = Date.now(), scrolled = false;
  window.addEventListener('scroll', function () { var h = document.documentElement; if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.25) scrolled = true; }, { passive: true });
  var iv = setInterval(function () { if (shown) return clearInterval(iv); var t = Date.now() - start; if ((t > 20000 && scrolled) || t > 45000) { clearInterval(iv); open(); } }, 1000);
})();
