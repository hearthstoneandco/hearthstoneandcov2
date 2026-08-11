#!/bin/bash
# Post-deploy smoke test for hearthstoneandco.com
# Run after every deploy. All checks must pass.
# Usage: bash smoke-test.sh
# In CI: set SITE_URL env var if needed

SITE="${SITE_URL:-https://hearthstoneandco.com}"
FAIL=0

check_200() {
  local url="$SITE/$1"
  local code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" != "200" ]; then
    echo "FAIL $code  /$1"
    FAIL=1
  else
    echo "OK   200   /$1"
  fi
}

check_301() {
  local url="$SITE/$1"
  local code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" != "301" ]; then
    echo "FAIL $code  /$1 (expected 301)"
    FAIL=1
  else
    echo "OK   301   /$1"
  fi
}

echo "=== Smoke test: $SITE ==="
echo ""

# Root files that must always exist
check_200 "robots.txt"
check_200 "sitemap.xml"
check_200 "favicon.ico"
check_200 "llms.txt"
check_200 "hero-founder.jpg"
check_200 "hero-founder.avif"
check_200 "hero-founder.webp"
check_200 "hero-founder-mobile.avif"
check_200 "hero-founder-mobile.webp"

# Key pages
check_200 ""
check_200 "healthcare-staffing-houston"
check_200 "about"
check_200 "contact"

# The redirect that must never become a 200
check_301 "healthcare-staffing"

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "ALL CHECKS PASSED"
else
  echo "SMOKE TEST FAILED — do not mark deploy as successful"
  exit 1
fi
