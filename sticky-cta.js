/* Hearthstone & Co. - sticky mobile CTA (UX audit CTA-7, 2026-11-02).
   Mobile only (<768px). Appears after the visitor scrolls past the first screen,
   hides while a form, the footer or the newsletter banner is on screen, and while
   the mobile menu is open. Facility pages: "Request Staffing"; clinician pages: "Apply".
   One tap-to-call button using the single published number. No tracking beyond the
   existing gtag event helper. */
(function () {
  var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  var SKIP = /^\/(request-staffing|contact|apply|join-our-network|careers-portal|bd-contact|teaming-inquiry|newsletter|privacy-policy|sms-consent|accessibility|terms-of-service|job-[a-z-]+)$/;
  if (SKIP.test(path) || path.indexOf('/admin') === 0) return;
  var clinician = /^\/(clinician-jobs|rn-jobs-houston|lvn-jobs-houston|cna-jobs-houston|careers|resources|clinician-onboarding-checklist|es\/.*|blog\/per-diem-vs-contract-career-stage|blog\/category\/clinician-careers)$/.test(path);
  var label = clinician ? 'Apply to Join Our Network' : 'Request Staffing';
  var href = clinician ? '/join-our-network' : '/request-staffing';

  var css = '#hs-sticky{display:none}' +
    '@media(max-width:767px){' +
    '#hs-sticky{position:fixed;left:0;right:0;bottom:0;z-index:950;display:flex;gap:8px;align-items:center;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #d9e2dc;box-shadow:0 -2px 8px rgba(0,0,0,.08);transform:translateY(110%);transition:transform .2s ease;font-family:"DM Sans",system-ui,sans-serif}' +
    '#hs-sticky.on{transform:none}' +
    '#hs-sticky a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;font-weight:700;text-decoration:none;font-size:.95rem}' +
    '#hs-sticky .p{flex:1;background:#1A3D2E;color:#fff}' +
    '#hs-sticky .c{width:48px;border:2px solid #1A3D2E;color:#1A3D2E;font-size:1.2rem}' +
    '#hs-sticky a:focus-visible{outline:3px solid #C9A84C;outline-offset:2px}' +
    'body.hs-sticky-pad{padding-bottom:calc(60px + env(safe-area-inset-bottom))}}' +
    '@media(prefers-reduced-motion:reduce){#hs-sticky{transition:none}}';

  function init() {
    var st = document.createElement('style'); st.id = 'hs-sticky-css'; st.textContent = css;
    document.head.appendChild(st);
    var bar = document.createElement('nav');
    bar.id = 'hs-sticky'; bar.setAttribute('aria-label', 'Quick actions');
    bar.innerHTML = '<a class="p" href="' + href + '">' + label + '</a>' +
      '<a class="c" href="tel:+17139383989" aria-label="Call Hearthstone &amp; Co. at (713) 938-3989">&#9742;</a>';
    document.body.appendChild(bar);
    document.body.classList.add('hs-sticky-pad');
    bar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        try { if (typeof gtag === 'function') gtag('event', a.className === 'c' ? 'sticky_call_click' : 'sticky_cta_click', { page_path: location.pathname }); } catch (e) {}
      });
    });
    var blockers = Array.prototype.slice.call(document.querySelectorAll('form, footer'));
    function onScreen(el) { var r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.height > 0; }
    function update() {
      var nl = document.querySelector('#hs-nl.on');
      var menu = document.querySelector('.mobile-open, .sn.open, .nav.open');
      var show = window.scrollY > innerHeight * 0.6 && !nl && !menu && !blockers.some(onScreen);
      bar.classList.toggle('on', show);
    }
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    setInterval(update, 1500);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
