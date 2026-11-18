#!/usr/bin/env bash
# First-time setup of rjsstore.com on an Ubuntu or Debian VPS. Run as root:
#
#   curl -fsSLO https://raw.githubusercontent.com/gts-trade-solutions/singapore-food-website/main/deploy/setup-server.sh
#   bash setup-server.sh you@example.com
#
# The email is optional. Let's Encrypt uses it to warn you if the HTTPS certificate ever fails to renew.
# Safe to run again: each step skips what is already in place. Later code updates use deploy/update.sh.
#
# What it does: installs Nginx, Node.js 22 and Certbot, creates a "rjsstore" user that runs the site,
# downloads and builds the site in /var/www/rjsstore, runs it as the "rjsstore" systemd service
# on 127.0.0.1:3100, points Nginx at it, and gets an HTTPS certificate once the domain's DNS points here.
set -euo pipefail

DOMAIN="rjsstore.com"
REPO="https://github.com/gts-trade-solutions/singapore-food-website.git"
APP_DIR="/var/www/rjsstore"
APP_USER="rjsstore"
SERVICE="rjsstore"
PORT=3100
CERT_EMAIL="${1:-}"

[ "$(id -u)" -eq 0 ] || { echo "Run this as root (e.g. sudo bash $0)."; exit 1; }
as_app() { runuser -u "$APP_USER" -- env HOME="/home/$APP_USER" PATH="/usr/local/bin:/usr/bin:/bin" "$@"; }

echo "==> Installing Nginx, Git and Certbot"
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y git nginx certbot python3-certbot-nginx curl ca-certificates

echo "==> Node.js"
if [ ! -x /usr/bin/node ] || [ "$(/usr/bin/node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
fi
echo "    Node $(/usr/bin/node -v)"

# Building the site needs about 2 GB of memory; small VPS plans get a swap file to make up the difference.
if [ "$(free -m | awk '/^Mem:/{print $2}')" -lt 2000 ] && [ -z "$(swapon --show)" ]; then
  echo "==> Adding a 2 GB swap file"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  echo "==> Opening ports 80 and 443 in the firewall"
  ufw allow 'Nginx Full'
fi

if ss -ltn "sport = :$PORT" | grep -q LISTEN && ! systemctl is-active --quiet "$SERVICE"; then
  echo "!! Port $PORT is already used by another program on this server."
  echo "   Pick a free port and change 3100 in deploy/rjsstore.service, deploy/nginx-rjsstore.conf and deploy/update.sh."
  exit 1
fi

echo "==> App user and code"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir "/home/$APP_USER" --shell /usr/sbin/nologin "$APP_USER"
if [ ! -d "$APP_DIR/.git" ]; then
  mkdir -p "$APP_DIR"
  chown "$APP_USER:$APP_USER" "$APP_DIR"
  as_app git clone "$REPO" "$APP_DIR"
fi
if [ ! -f "$APP_DIR/.env.production.local" ]; then
  cat > "$APP_DIR/.env.production.local" <<EOF
# Settings for the live site. Changes take effect after: bash $APP_DIR/deploy/update.sh
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXT_PUBLIC_SHOW_CERTIFICATIONS=false
NEWSLETTER_WEBHOOK_URL=
EOF
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env.production.local"
  chmod 600 "$APP_DIR/.env.production.local"
fi

echo "==> Service"
cp "$APP_DIR/deploy/rjsstore.service" "/etc/systemd/system/$SERVICE.service"
systemctl daemon-reload
systemctl enable "$SERVICE"

bash "$APP_DIR/deploy/update.sh"

echo "==> Nginx"
SITE_CONF="/etc/nginx/sites-available/$DOMAIN"
# On a re-run, keep the file once Certbot has added HTTPS to it.
if ! grep -q "managed by Certbot" "$SITE_CONF" 2>/dev/null; then
  cp "$APP_DIR/deploy/nginx-rjsstore.conf" "$SITE_CONF"
fi
ln -sf "$SITE_CONF" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

echo "==> HTTPS"
SERVER_IP="$(curl -4 -fsS https://api.ipify.org || true)"
dns_ip() { getent ahostsv4 "$1" | awk '{print $1}' | sort -u | tr '\n' ' ' | sed 's/ $//'; }
APEX_IP="$(dns_ip "$DOMAIN")"
WWW_IP="$(dns_ip "www.$DOMAIN")"

if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "    Certificate already in place; Certbot renews it automatically."
elif [ -n "$SERVER_IP" ] && [ "$APEX_IP" = "$SERVER_IP" ] && [ "$WWW_IP" = "$SERVER_IP" ]; then
  if [ -n "$CERT_EMAIL" ]; then email_args=(-m "$CERT_EMAIL"); else email_args=(--register-unsafely-without-email); fi
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect --agree-tos --non-interactive "${email_args[@]}"
else
  echo "    Skipped for now: the domain does not point to this server yet."
  echo "      This server:       ${SERVER_IP:-unknown}"
  echo "      $DOMAIN:       ${APEX_IP:-no record}"
  echo "      www.$DOMAIN:   ${WWW_IP:-no record}"
  echo "    In GoDaddy DNS, set the A record for @ to ${SERVER_IP:-the IP of this server} (www is a CNAME to @)."
  echo "    Once that has spread (check with: getent hosts $DOMAIN), run this script again to add HTTPS."
fi

echo
echo "All set. The site runs as the '$SERVICE' service."
echo "  Update to the latest code:  bash $APP_DIR/deploy/update.sh"
echo "  Logs:                       journalctl -u $SERVICE -f"
