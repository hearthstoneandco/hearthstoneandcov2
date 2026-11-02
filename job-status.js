/* Closes job pages automatically. The closing time comes from the page's JobPosting "validThrough" (or a
   data-job-closes attribute). Before it, [data-job-open] elements show and [data-job-closed] elements hide;
   after it, the reverse. The careers portal applies the same date check to ROLES[role].closes. */
(function () {
  function closesAt() {
    var el = document.querySelector('[data-job-closes]');
    if (el) return Date.parse(el.getAttribute('data-job-closes'));
    var blocks = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < blocks.length; i++) {
      try {
        var d = JSON.parse(blocks[i].textContent);
        var list = Array.isArray(d) ? d : (d['@graph'] || [d]);
        for (var j = 0; j < list.length; j++) if (list[j]['@type'] === 'JobPosting' && list[j].validThrough) return Date.parse(list[j].validThrough);
      } catch (e) {}
    }
    return NaN;
  }
  function apply() {
    var t = closesAt();
    if (isNaN(t)) return;
    var closed = Date.now() > t;
    document.querySelectorAll('[data-job-open]').forEach(function (n) { n.hidden = closed; });
    document.querySelectorAll('[data-job-closed]').forEach(function (n) { n.hidden = !closed; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
