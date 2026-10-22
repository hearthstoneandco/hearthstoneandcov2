/* Hearthstone & Co. — conversion events for Google Analytics (GA4). No personal data is sent. */
(function () {
  function send(name, params) {
    try { if (typeof gtag === 'function') { gtag('event', name, params || {}); } } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var p = { link_url: h, page_path: location.pathname };
    if (h.indexOf('tel:') === 0) send('phone_click', p);
    else if (h.indexOf('mailto:') === 0) send('email_click', p);
    else if (h.indexOf('calendly.com') > -1) send('calendly_click', p);
    else if (h.indexOf('request-staffing') > -1) send('request_staffing_click', p);
  }, true);
  document.addEventListener('submit', function (e) {
    var f = e.target;
    send('form_submit', { form_name: (f.getAttribute && (f.getAttribute('name') || f.id)) || 'form', page_path: location.pathname });
  }, true);
})();
