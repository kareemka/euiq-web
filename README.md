# EUIQ storefront

Arabic Next.js storefront: https://euiq.store

This repository contains the website. The Flutter administration app and Supabase server configuration are maintained separately.

## Local development

Use Node.js 24 LTS. Copy `.env.example` to `.env.local` and set the public Supabase URL and anonymous key. Never put a service-role key, SSH key, Firebase service account, or WhatsApp API key in this repository.

```sh
npm ci
npm run dev
npm test
npm run build
```

## Banner destinations

Clicking anywhere on a home-page banner opens the destination chosen for it in the admin app. The storefront reads these fields from each banner returned by `catalog_page`:

- `target_product_id` (and optionally `target_product_slug`): opens that product. Takes priority when both are set.
- `target_category_id`: opens that category.
- Neither set: opens all products.

`target_product_id` must exist on the `banners` table and be returned by `catalog_page`; until then, banners link to their category or to all products.

## Production deployment

- Checkout: `/var/www/euiq-web`
- Application user: `euiqweb`
- Node.js: 24 LTS; PM2: 7
- PM2 process: `euiq-web`, configured by `ecosystem.config.cjs`
- Listener: `127.0.0.1:3000`, behind Nginx
- Environment: `/var/www/euiq-web/.env.local`, owned by the application user with mode `0600`
- Startup service: `pm2-euiqweb.service`, enabled in systemd
- PM2 saved process list: `/var/lib/euiqweb/.pm2/dump.pm2`
- Nginx configuration: `/etc/nginx/sites-available/euiq-web`
- HTTPS certificate: `/etc/letsencrypt/live/euiq.store/`; renewed through `certbot.timer` with an Nginx reload hook
- `www.euiq.store` redirects to `https://euiq.store`

Run the following as root on the VPS to deploy an update. Review the build result before restarting the application:

```sh
cd /var/www/euiq-web
runuser -u euiqweb -- git pull --ff-only origin main
runuser -u euiqweb -- env HOME=/var/lib/euiqweb npm ci
runuser -u euiqweb -- env HOME=/var/lib/euiqweb NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 npm run build
runuser -u euiqweb -- env HOME=/var/lib/euiqweb pm2 restart ecosystem.config.cjs --update-env
runuser -u euiqweb -- env HOME=/var/lib/euiqweb pm2 save
```

Checks and logs:

```sh
systemctl is-active pm2-euiqweb
systemctl is-enabled pm2-euiqweb
runuser -u euiqweb -- env HOME=/var/lib/euiqweb pm2 status
runuser -u euiqweb -- env HOME=/var/lib/euiqweb pm2 logs euiq-web --lines 50
curl -I https://euiq.store
systemctl status certbot.timer
```

PM2 commands must run as `euiqweb` so they control the saved application daemon. The enabled systemd service restores that process list after a server reboot. This setup uses one application process; allow a short maintenance window for application restarts and builds.
