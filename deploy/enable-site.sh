#!/usr/bin/env bash
# Connect rjsstore.com to the running site in Nginx and add HTTPS. Needs sudo, once:
#   sudo bash ~/rjsstore/deploy/enable-site.sh
#
# Run it after deploy/update.sh has started the site. Safe to run again: if the domain's DNS
# doesn't point to this server yet, it sets up Nginx and adds HTTPS on a later run.
# It only adds files for rjsstore.com and checks the Nginx config before reloading,
# so the other sites on the server are not affected.
set -euo pipefail

DOMAIN="rjsstore.com"
HERE="$(cd "$(dirname "$0")" && pwd)"
SITE_CONF="/etc/nginx/sites-available/$DOMAIN"
SITE_LINK="/etc/nginx/sites-enabled/$DOMAIN"

[ "$(id -u)" -eq 0 ] || { echo "Run this with sudo: sudo bash $0"; exit 1; }

echo "==> Nginx"
# Once Certbot has added HTTPS to the file, keep it as it is.
if ! grep -q "managed by Certbot" "$SITE_CONF" 2>/dev/null; then
  cp "$HERE/nginx-rjsstore.conf" "$SITE_CONF"
fi
ln -sf "$SITE_CONF" "$SITE_LINK"
if ! nginx -t; then
  echo "!! The Nginx config check failed, so nothing was reloaded. Removing the rjsstore.com site again."
  rm -f "$SITE_LINK"
  exit 1
fi
systemctl reload nginx
echo "    http://$DOMAIN is connected."

echo "==> HTTPS"
SERVER_IP="$(curl -4 -fsS --max-time 10 https://api.ipify.org || hostname -I | awk '{print $1}')"
dns_ip() { getent ahostsv4 "$1" | awk '{print $1}' | sort -u | tr '\n' ' ' | sed 's/ $//'; }
APEX_IP="$(dns_ip "$DOMAIN")"
WWW_IP="$(dns_ip "www.$DOMAIN")"

if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "    Certificate already in place; Certbot renews it automatically."
elif [ "$APEX_IP" = "$SERVER_IP" ] && [ "$WWW_IP" = "$SERVER_IP" ]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect --non-interactive --agree-tos
  echo "    https://$DOMAIN is live."
else
  echo "    Skipped for now: the domain does not point to this server yet."
  echo "      This server:       $SERVER_IP"
  echo "      $DOMAIN:       ${APEX_IP:-no record}"
  echo "      www.$DOMAIN:   ${WWW_IP:-no record}"
  echo "    In GoDaddy DNS, set the A record for @ to $SERVER_IP (www is a CNAME to @),"
  echo "    then run this script again."
fi
