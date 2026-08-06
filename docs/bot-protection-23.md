# Bot Protection Configuration

Status: blocked on Vercel dashboard permission. No production setting changed.

## Target configuration

- Vercel project: `petermoelzer-shellfolio`
- Scope: all public pages, worldwide
- Action: challenge suspicious non-browser traffic
- Verified Google/Bing crawlers: allow
- Accessibility tools: avoid hard blocking; provide retry/support fallback
- Accounts: not required
- Rollout: observe/log first if the ruleset supports it, then challenge
- Emergency control: documented dashboard disable path

## Manual action

1. Open the project in Vercel Dashboard.
2. Open **Firewall** and **Bot Management**.
3. Check whether **Bot Protection managed ruleset** is available to this account.
4. Enable log/observe mode first where available.
5. Review verified-bot bypass behavior and configure challenge mode for suspicious traffic.
6. Record vendor cookies, browser signals, retention, transfers, subprocessors, and privacy notice updates.
7. Test normal browser, JavaScript-disabled browser, screen reader, VPN/mobile network, Googlebot/Bingbot, and curl.
8. Keep the dashboard disable path available for false-positive incidents.

## Why no code change

Vercel's managed protection operates at the CDN/firewall layer. Repository code cannot enable the project-level ruleset. Vercel documents Bot Protection as permission-gated and Attack Mode as a separate free, temporary control for active attacks.

Sources:

- https://vercel.com/docs/bot-management
- https://vercel.com/docs/vercel-firewall/attack-mode
