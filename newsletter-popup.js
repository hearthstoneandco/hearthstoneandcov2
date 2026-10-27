/* Hearthstone & Co. - newsletter signup popup.
   Shows once per visitor (re-offered after 45 days if dismissed, never after subscribing).
   Skipped on form/conversion pages so it never interrupts a staffing request or application.
   Submits to the Netlify form "newsletter" declared on /newsletter. No personal data is sent to analytics. */
(function () {
  var SKIP = /^\/(request-staffing|contact|apply|join-our-network|careers-portal|bd-contact|teaming-inquiry|newsletter|privacy-policy|sms-consent|accessibility|terms-of-service|admin)(\/|\.html)?$/;
  var path = location.pathname.replace(/\/$/, '');
  if (SKIP.test(path) || path.indexOf('/admin') === 0) return;
  var KEY = 'hs_nl', DAYS = 45;
  function get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var st = get();
  if (st && (st.done || (Date.now() - st.t) < DAYS * 864e5)) return;
  function ev(n) { try { if (typeof gtag === 'function') gtag('event', n, { page_path: location.pathname }); } catch (e) {} }
  var shown = false, lastFocus = null;

  var css = '#hs-nl{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:1rem;background:rgba(10,25,18,.62)}' +
    '#hs-nl.on{display:flex}#hs-nl .box{position:relative;max-width:440px;width:100%;background:#fff;border-top:5px solid #C9A84C;border-radius:10px;padding:2rem 1.6rem 1.5rem;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:"DM Sans",system-ui,sans-serif;color:#22302A}' +
    '#hs-nl .k{font-family:"Space Mono",monospace;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#8a6d1f;margin:0 0 .4rem}' +
    '#hs-nl h2{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.7rem;line-height:1.15;color:#1A3D2E;margin:0 0 .6rem}' +
    '#hs-nl p{margin:0 0 .9rem;font-size:.95rem;line-height:1.5}#hs-nl label{display:block;font-size:.8rem;font-weight:600;margin:0 0 .25rem}' +
    '#hs-nl input[type=email],#hs-nl input[type=text]{width:100%;box-sizing:border-box;padding:.7rem .8rem;border:1px solid #b9c4bd;border-radius:6px;font-size:1rem;margin-bottom:.7rem}' +
    '#hs-nl button.go{width:100%;background:#1A3D2E;color:#fff;border:0;border-radius:6px;padding:.8rem;font-size:1rem;font-weight:600;cursor:pointer}' +
    '#hs-nl button.go:hover{background:#245238}#hs-nl button.x{position:absolute;top:.4rem;right:.5rem;background:none;border:0;font-size:1.6rem;line-height:1;color:#55645C;cursor:pointer;padding:.3rem .5rem}' +
    '#hs-nl .fine{font-size:.76rem;color:#55645C;margin:.7rem 0 0}#hs-nl .fine a{color:#1A3D2E}#hs-nl .no{display:block;margin:.6rem auto 0;background:none;border:0;color:#55645C;font-size:.8rem;text-decoration:underline;cursor:pointer}' +
    '#hs-nl :focus-visible{outline:3px solid #C9A84C;outline-offset:2px}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var wrap = document.createElement('div'); wrap.id = 'hs-nl'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-labelledby', 'hs-nl-h');
  wrap.innerHTML = '<div class="box"><button type="button" class="x" aria-label="Close">&times;</button>' +
    '<div id="hs-nl-form"><p class="k">The Hearthstone Brief</p><h2 id="hs-nl-h">One useful email a month for Houston facility leaders</h2>' +
    '<p>Staffing and credentialing know-how, planning checklists and procurement updates from a veteran-owned, Katy-based healthcare staffing company.</p>' +
    '<form name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="newsletter">' +
    '<p hidden><label>Do not fill this out <input name="bot-field"></label></p>' +
    '<label for="hs-nl-e">Work email</label><input id="hs-nl-e" type="email" name="email" required autocomplete="email" placeholder="you@organization.com">' +
    '<button class="go" type="submit">Subscribe</button></form>' +
    '<p class="fine">About once a month. Unsubscribe anytime. <a href="/privacy-policy">Privacy Policy</a></p><button type="button" class="no">No thanks</button></div>' +
    '<div id="hs-nl-ok" hidden role="status"><p class="k">Subscribed</p><h2>You are on the list</h2><p>Thank you. Look for the next issue in your inbox.</p></div></div>';
  document.body.appendChild(wrap);

  function open() { if (shown) return; shown = true; lastFocus = document.activeElement; wrap.classList.add('on'); document.getElementById('hs-nl-e').focus(); ev('newsletter_popup_view'); }
  function close(done) { wrap.classList.remove('on'); set({ t: Date.now(), done: !!done }); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  wrap.querySelector('.x').onclick = function () { ev('newsletter_popup_close'); close(false); };
  wrap.querySelector('.no').onclick = function () { ev('newsletter_popup_close'); close(false); };
  wrap.addEventListener('click', function (e) { if (e.target === wrap) close(false); });
  document.addEventListener('keydown', function (e) {
    if (!wrap.classList.contains('on')) return;
    if (e.key === 'Escape') close(false);
    if (e.key === 'Tab') { var f = wrap.querySelectorAll('button,input:not([type=hidden]),a'); var v = Array.prototype.filter.call(f, function (n) { return n.offsetParent !== null; }); if (!v.length) return; var a = v[0], z = v[v.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  wrap.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target, b = f.querySelector('button.go'), t = b.textContent; b.disabled = true; b.textContent = 'Subscribing...';
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
      .then(function (r) { if (!r.ok) throw 0; document.getElementById('hs-nl-form').hidden = true; document.getElementById('hs-nl-ok').hidden = false; set({ t: Date.now(), done: true }); ev('newsletter_signup'); setTimeout(function () { wrap.classList.remove('on'); }, 3500); })
      .catch(function () { b.disabled = false; b.textContent = t; var m = document.createElement('p'); m.setAttribute('role', 'alert'); m.className = 'fine'; m.textContent = 'Something went wrong. Please try again or email hello@hearthstoneandco.com.'; f.appendChild(m); });
  });

  /* Triggers: desktop exit-intent, or after 35s plus 40% scroll (also covers mobile). Never before 12s. */
  var start = Date.now(), scrolled = false;
  window.addEventListener('scroll', function () { var h = document.documentElement; if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.4) scrolled = true; }, { passive: true });
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8 && Date.now() - start > 12000) open(); });
  var iv = setInterval(function () { if (shown) return clearInterval(iv); if (Date.now() - start > 35000 && scrolled) { clearInterval(iv); open(); } }, 1500);
})();
