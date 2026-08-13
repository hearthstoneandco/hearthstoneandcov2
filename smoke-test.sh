#!/bin/bash
# Post-deploy smoke test for hearthstoneandco.com
# Walks the live sitemap — every URL it advertises must return 200.
# Also checks critical root files and the healthcare-staffing redirect.
# Usage: bash smoke-test.sh
# In CI: exits nonzero on any failure.

SITE="${SITE_URL:-https://hearthstoneandco.com}"
FAIL=0

echo "=== Smoke test: $SITE ==="
echo ""

# Walk the sitemap — every advertised URL must return 200
echo "-- Sitemap URLs --"
for u in $(curl -s "$SITE/sitemap.xml" | grep -o '<loc>[^<]*' | sed 's/<loc>//'); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$u")
  if [ "$code" != "200" ]; then
    echo "FAIL $code  $u"
    FAIL=1
  else
    echo "OK   200   $u"
  fi
done

echo ""
echo "-- Root files --"
for f in robots.txt sitemap.xml favicon.ico llms.txt hero-founder.jpg hero-founder.avif hero-founder.webp hero-founder-mobile.avif hero-founder-mobile.webp; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SITE/$f")
  if [ "$code" != "200" ]; then
    echo "FAIL $code  /$f"
    FAIL=1
  else
    echo "OK   200   /$f"
  fi
done

echo ""
echo "-- Redirect check --"
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SITE/healthcare-staffing")
if [ "$code" != "301" ]; then
  echo "FAIL $code  /healthcare-staffing (expected 301)"
  FAIL=1
else
  echo "OK   301   /healthcare-staffing → /healthcare-staffing-houston"
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "ALL CHECKS PASSED"
else
  echo "SMOKE TEST FAILED — do not mark deploy as successful"
  exit 1
fi
