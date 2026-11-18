#!/usr/bin/env bash
# Put the latest code from GitHub live on the server. Run as root on the VPS:
#   bash /var/www/rjsstore/deploy/update.sh
#
# The new version is built in a side folder (.next-build) while the current site keeps running.
# The live site is only restarted once the build has succeeded, so it is down for a second or two.
# The previous build is kept in .next-old. To go back to it, see "Rolling back" in README.md.
set -euo pipefail

APP_DIR="/var/www/rjsstore"
APP_USER="rjsstore"
SERVICE="rjsstore"
PORT=3100

[ "$(id -u)" -eq 0 ] || { echo "Run this as root (e.g. sudo bash $0)."; exit 1; }
cd "$APP_DIR"

# Run a command as the app user, with that user's home folder (npm keeps its cache there)
# and the system Node.js (not one installed for root only, e.g. through nvm).
as_app() { runuser -u "$APP_USER" -- env HOME="/home/$APP_USER" PATH="/usr/local/bin:/usr/bin:/bin" "$@"; }

echo "==> Getting the latest code"
as_app git pull --ff-only

# Reinstall packages only when package-lock.json has changed since the last install.
lock_hash="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ ! -d node_modules ] || [ "$(cat node_modules/.lock-hash 2>/dev/null)" != "$lock_hash" ]; then
  echo "==> Installing packages"
  as_app npm ci --no-audit --no-fund
  as_app sh -c "echo $lock_hash > node_modules/.lock-hash"
fi

echo "==> Building (the current site stays up meanwhile)"
as_app rm -rf .next-build
as_app env NEXT_DIST_DIR=.next-build NEXT_TELEMETRY_DISABLED=1 npm run build

echo "==> Switching to the new build"
as_app rm -rf .next-old
if [ -d .next ]; then as_app mv .next .next-old; fi
as_app mv .next-build .next
systemctl restart "$SERVICE"

for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then
    echo "==> Done: $(git log -1 --format='%h %s') is live."
    exit 0
  fi
  sleep 1
done
echo "!! The site did not come back up. Recent logs:"
journalctl -u "$SERVICE" -n 40 --no-pager
exit 1
