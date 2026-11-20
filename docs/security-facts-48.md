# Security Facts — Compiled from Stack and Deployment

Issue: #48 (Part of #46)
Compiled: 2026-11-20
Method: source inspection of the current branch, `gh` repository metadata, and live HTTP/DNS-less probes against `https://petermoelzer-shellfolio.vercel.app/` (curl + clean-profile headless Chromium).

Every statement below is reproducible from the cited source. Statements that only the owner or a vendor can confirm are **not** in section 1 — they are in the gap list (section 3).

---

## 1. Verified statements

### 1.1 Encryption in transit

| Statement | Evidence |
| --- | --- |
| The site is served over HTTPS only; plain HTTP redirects permanently to HTTPS. | `curl -I http://petermoelzer-shellfolio.vercel.app/` → `308 Permanent Redirect`, `Location: https://…` (2026-11-20). |
| Production responses carry HSTS for two years, including subdomains, with `preload`. | `strict-transport-security: max-age=63072000; includeSubDomains; preload` on the `200` response to `GET /` (2026-11-20). Certificates are issued and renewed by the hosting platform; no certificate handling exists in this repository (`next.config.ts` has no TLS configuration). |
| TLS termination and edge delivery are provided by Vercel. | `server: Vercel`, `x-vercel-cache: PRERENDER`, `x-vercel-id: fra1::…` on the same response. |

### 1.2 Encryption at rest

| Statement | Evidence |
| --- | --- |
| This application stores no user-submitted records, so there is no application-level data-at-rest store to describe. | No API routes (`src/app` contains only `page.tsx` files for `/`, `/privacy`, `/privacy-policy`), no server actions, no database client in `package.json` (no Prisma/Drizzle/Supabase/Firebase SDK actually imported — `firebase` and `genkit` are listed dependencies but are not imported by any page), no forms. |
| No environment secrets are committed to the repository. | `git ls-files` contains no `.env*`, credential, or key file; `.gitignore:41` ignores `.env*`. The only match for "credential" is `src/lib/terminal/commands/credentials.tsx`, which renders CV content. |

### 1.3 Data residency

| Statement | Evidence |
| --- | --- |
| Requests observed from this location are served from the Frankfurt region (`fra1`). | `x-vercel-id: fra1::…` on both the `200` and the `429` responses (2026-11-20). |
| Pages are prerendered at build time and cached at the edge; there is no per-request server-side user-data processing. | `x-vercel-cache: PRERENDER`; every route is a static/server component with no request handlers. No `headers()`, `cookies()`, `searchParams` use, and no `dynamic` export in source. |
| The site accepts no user accounts and no user content, so there is no customer data whose residency could vary. | Section 1.2 plus `docs/privacy-inventory.md` ("Not found in source: forms, auth, account, admin, checkout, API routes"). |

### 1.4 Third-party requests and browser storage

Verified in a clean Chromium profile against production, 8 seconds after `load` (2026-11-20):

| Statement | Evidence |
| --- | --- |
| No third-party host is contacted on first load. Fonts, images, and scripts are all served from the site's own origin. | Request log filtered to non-`vercel.app` hosts → `(none)`. The font is self-hosted at build time via `next/font/google` (`src/app/layout.tsx:3`), which removes the runtime `fonts.googleapis.com`/`fonts.gstatic.com` requests recorded in `docs/privacy-verification-20.md`. |
| No cookies are set on first load. | `document.cookie === ""` after 8s. The sidebar cookie helper in `src/components/ui/sidebar.tsx` is dead code — `grep -rn "ui/sidebar" src/` → no importers. |
| One first-party localStorage key is written on first load: `shellfolio_privacy_consent`, holding per-category booleans and a timestamp. | Clean-profile probe → `{"analytics":true,"performance":true,"clarity":true,"updatedAt":…}`; written by `src/components/PrivacyConsent.tsx` (`CONSENT_KEY`, `saveConsent`). |
| `sessionStorage` is empty until the terminal is used; afterwards it holds only the command history list (`terminal_history`, commands and timestamps only, no output). | `src/lib/terminal/history-store.ts:19,33`; probe after load → `[]`. |
| Theme choice is stored locally under `shellfolio_theme` only after a theme change. | `src/lib/terminal/theme-manager.ts:48,60`. |
| Optional telemetry is not loaded until consent state allows it; the consent UI renders a settings dialog on first visit with equal-acceptance "Save choices" and "Reject all" buttons. | `src/components/Telemetry.tsx` returns `null` without consent state and mounts `Analytics`/`SpeedInsights`/`Clarity` per category; `src/components/PrivacyConsent.tsx` dialog markup. |
| Microsoft Clarity initializes only if `NEXT_PUBLIC_CLARITY_PROJECT_ID` is present in the environment, and never on `/admin`, `/login`, `/register`, `/account`, `/dashboard`, `/checkout`. | `src/components/MicrosoftClarity.tsx:16,26-34`. None of those routes exist in this repository. |
| Consent is stored for at most 180 days and can be changed at any time through the persistent "Privacy settings" trigger. | `CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000`; expiry check in `readConsent()`; persistent trigger button in `PrivacyConsent.tsx`. |

### 1.5 Network-level bot mitigation

| Statement | Evidence |
| --- | --- |
| A managed browser challenge is active in production for suspicious non-browser traffic, worldwide. | `GET /` with curl and with a spoofed Chrome user agent both return `429 Too Many Requests` with `X-Vercel-Mitigated: challenge` and a challenge token (2026-11-20). A real browser (headless Chromium) receives `200`. |
| The challenge is enforced at the CDN layer; no repository code implements it. | No `middleware.ts`, no `vercel.json`, no rate-limit or captcha code in `src/`. |

> **Stale doc:** `docs/bot-protection-23.md` states "Status: blocked on Vercel dashboard permission. No production setting changed." That is no longer accurate — the challenge is live. Only the owner can confirm the dashboard's exact ruleset (managed vs. custom), its logging mode, and whether verified crawlers are bypassed.

### 1.6 Access controls (repository-level)

| Statement | Evidence |
| --- | --- |
| The source repository is public and world-readable; write access is limited to the owner account. | `gh repo view` → `"visibility": "PUBLIC"`, owner `peterle95`; `git shortlog` shows the owner plus 2 human contributors and 1 bot on this branch. |
| Deployment configuration and secrets live in the hosting platform dashboard and local untracked `.env.local`, not in the repository. | No `vercel.json`; `.env*` gitignored; no CI workflow files in the repository, so no third-party CI secrets are involved. |
| There is no administrative surface in the application itself: no login, admin, or account routes. | `src/app` route list (three `page.tsx` files only); `docs/privacy-inventory.md`. |

---

## 2. Findings that constrain what may be published

These are contradictions or gaps discovered while compiling, and they directly limit the wording of any security disclosure (#50):

1. **Consent was opt-out, not opt-in — fixed 2026-11-20 in #53.** At compilation time `DEFAULT_CONSENT` was all-`true` and the first-visit effect persisted that before the visitor acted. It now defaults to all-`false`, records nothing until a choice is made, and keeps the dialog open until then (`src/components/PrivacyConsent.tsx:9,63-70`). Verified on a production build: first visit writes no storage and issues no analytics/Clarity request; "Reject all" stores three `false`; selecting only Vercel Analytics stores `{analytics:true,performance:false,clarity:false}`. An opt-in statement about analytics is therefore supportable as of this date.
2. **No Content-Security-Policy or other custom security headers.** `next.config.ts` defines only `typescript.ignoreBuildErrors` and image `remotePatterns`; there is no `headers()` block, so no CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` is set by this application. Only HSTS appears, and it comes from the platform. Do not claim a hardened header policy.
3. **`typescript.ignoreBuildErrors: true`** means type errors do not fail a production build. Worth knowing before making any "reviewed and tested before deploy" style claim; there is also no automated security scanning in the repository.
4. **Existing privacy docs are partly stale.** `docs/privacy-inventory.md` still lists Google Fonts as an external request and describes `Analytics`/`SpeedInsights` as rendered directly by `layout.tsx`; both changed with self-hosting and the `Telemetry` component. Do not source disclosure wording from that file without re-checking against the current code.
5. **Unused heavy dependencies.** `firebase` and `@genkit-ai/*` are declared in `package.json` but not imported by any page. Not a disclosure item, but it widens the supply-chain surface for no user-facing benefit.

---

## 3. Gap list — not verifiable from the repository

### 3.1 Owner-only facts (feeds #49)

| Gap | Why it cannot be derived |
| --- | --- |
| Vulnerability disclosure contact / reporting route | No `SECURITY.md`, no security contact in `src/`, no `.well-known/security.txt`. Only `moelzerpeter@proton.me` (privacy) and `moelzerpeter@gmail.com` (LifeBot privacy page) exist. |
| Incident history | Not recorded anywhere in the repository; only the owner knows whether anything must be disclosed. |
| Penetration testing / audits | No reports or references in `docs/`. |
| Certifications (SOC 2 / ISO 27001 / GDPR badge / HIPAA) | Cannot be asserted or denied from code; the map's working assumption is "not applicable to a personal portfolio" and needs explicit owner confirmation. |
| GitHub and Vercel access reality: number of members, MFA enforcement, deploy permissions | Account-level dashboard settings, invisible to this repository. Repo being public is verified; membership/MFA is not. |
| Whether `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set in production | Source gates Clarity on it, but the value lives in the hosting environment. If unset, Clarity never runs and the disclosure should say so. |
| Legal confirmation of the German controller basis (Peter Mölzer, #19) | Flagged as pending legal confirmation in the privacy map. |

### 3.2 Vendor facts

| Gap | Owner of the fact |
| --- | --- |
| Vercel processing locations, edge/log retention, subprocessor list, DPA availability | Vercel documentation / dashboard |
| Vercel Analytics and Speed Insights: identifiers, retention, whether any cookie is set | Vercel documentation / dashboard; a production consent-accepted run is needed to observe actual requests (the clean-profile probe produced no third-party hosts because telemetry had not yet initialized within the window) |
| Microsoft Clarity: cookies, session replay scope, masking rules, retention, transfers | Microsoft documentation / project settings |
| Managed Bot Challenge ruleset, logging mode, verified-crawler bypass | Vercel dashboard (per #23) |

---

## 4. What #50 may state today, and what it may not

**Safe to state now, sourced above:** HTTPS-only with HSTS and a permanent HTTP→HTTPS redirect; no accounts, forms, or stored user records; no third-party requests on first load with fonts self-hosted; exactly one first-party consent key plus optional terminal/theme storage, all local to the browser; the three named optional telemetry services and how to switch them off; a managed bot challenge at the CDN; repository is public with owner-only write access.

**Not safe to state yet:** any header-hardening claim beyond HSTS (finding 2); anything about incident history, audits, certification, or a security contact (section 3.1); any specific vendor retention or residency guarantee (section 3.2); "GDPR compliant" or similar badges, which the map already rules out of scope.
