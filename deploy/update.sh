#!/usr/bin/env bash
# Put the latest code from GitHub live on the VPS. Run as the "deploy" user (no sudo needed):
#   bash ~/rjsstore/deploy/update.sh
#
# First time on a server:
#   git clone https://github.com/gts-trade-solutions/singapore-food-website.git ~/rjsstore
#   bash ~/rjsstore/deploy/update.sh
#
# The new version is built in a side folder (.next-build) while the current site keeps running.
# The site is only restarted once the build has succeeded, so it is down for a second or two.
# The previous build is kept in .next-old (see "Rolling back" in README.md).
set -euo pipefail

APP_NAME="rjsstore"   # pm2 process name
PORT=3100             # must match proxy_pass in deploy/nginx-rjsstore.conf
cd "$(dirname "$0")/.."

echo "==> Getting the latest code"
git pull --ff-only

if [ ! -f .env.production.local ]; then
  echo "==> Creating .env.production.local (settings for the live site)"
  cat > .env.production.local <<'EOF'
# Settings for the live site. Changes take effect after: bash ~/rjsstore/deploy/update.sh
NEXT_PUBLIC_SITE_URL=https://rjsstore.com
NEXT_PUBLIC_SHOW_CERTIFICATIONS=false
NEWSLETTER_WEBHOOK_URL=
EOF
  chmod 600 .env.production.local
fi

# Reinstall packages only when package-lock.json has changed since the last install.
lock_hash="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ ! -d node_modules ] || [ "$(cat node_modules/.lock-hash 2>/dev/null)" != "$lock_hash" ]; then
  echo "==> Installing packages"
  npm ci --no-audit --no-fund
  echo "$lock_hash" > node_modules/.lock-hash
fi

echo "==> Building (the current site stays up meanwhile)"
rm -rf .next-build
NEXT_DIST_DIR=.next-build NEXT_TELEMETRY_DISABLED=1 npm run build

echo "==> Switching to the new build"
rm -rf .next-old
if [ -d .next ]; then mv .next .next-old; fi
mv .next-build .next

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  NEXT_TELEMETRY_DISABLED=1 pm2 start node_modules/next/dist/bin/next --name "$APP_NAME" --cwd "$PWD" -- start -H 127.0.0.1 -p "$PORT"
  pm2 save   # so pm2 starts the site again after a reboot
fi

for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
    echo "==> Done: $(git log -1 --format='%h %s') is live."
    exit 0
  fi
  sleep 1
done
echo "!! The site did not come back up. Recent logs:"
pm2 logs "$APP_NAME" --lines 40 --nostream
exit 1
