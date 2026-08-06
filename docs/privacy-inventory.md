# Privacy Inventory

Source inspection completed 2026-08-06. Browser DevTools verification remains required for exact cookie names, request payloads, retention, and deployed CDN behavior.

| Technology or flow | Provider | Purpose | Trigger | Initial classification | Consent gate |
| --- | --- | --- | --- | --- | --- |
| `@vercel/analytics/next` | Vercel | Web analytics | Every page render from `src/app/layout.tsx` | Optional analytics; confirm configuration and identifiers | Yes, block until analytics consent |
| `@vercel/speed-insights/next` | Vercel | Performance telemetry | Every page render from `src/app/layout.tsx` | Optional measurement; confirm whether deployment treats it as strictly necessary | Yes unless documented as strictly necessary for requested service |
| `@microsoft/clarity` | Microsoft | Session/behavior analytics | Client effect when `NEXT_PUBLIC_CLARITY_PROJECT_ID` exists; excludes selected paths | Optional analytics; likely cookies/session recording and telemetry | Yes, block until analytics consent |
| `localStorage['shellfolio_theme']` | First party browser storage | Persist selected visual theme | Theme change and theme-manager initialization | Strictly necessary only if persistence is considered requested feature state; otherwise preferences | Document exemption or gate as preferences |
| `sessionStorage['terminal_history']` | First party browser storage | Persist terminal history for current tab/session | Terminal history load/save | Strictly necessary for requested interactive terminal state | Document exemption |
| `document.cookie` sidebar state | First party browser cookie | Persist sidebar open/closed state | Sidebar state change | Preference storage; likely not strictly necessary | Gate or replace with non-cookie storage; document reason |
| Google Fonts stylesheet and preconnects | Google | Load Source Code Pro font | Every page render from `src/app/layout.tsx` | Third-party request; may disclose IP and user agent even without cookies | Self-host or gate; inventory deployed request and policy basis |
| Favicon | First party `/favicon-16x16.png` | Browser tab icon | Browser request | Strictly necessary presentation asset | No |
| Project/social links | GitHub, LinkedIn, external project sites | User-initiated navigation | Link activation only | No automatic tracking found | No pre-load; external privacy notices apply |

## Source evidence

- `src/app/layout.tsx`: Vercel Analytics, Speed Insights, Google Fonts, favicon, Clarity.
- `src/components/MicrosoftClarity.tsx`: Clarity initialization and blocked-path list.
- `src/lib/terminal/theme-manager.ts`: theme local storage.
- `src/lib/terminal/history-store.ts`: terminal session storage.
- `src/components/ui/sidebar.tsx`: sidebar cookie.
- `src/lib/portfolio-data.ts`: external links only.

## Not found in source

- Forms or server-side submissions.
- Embedded iframes, advertising pixels, social widgets, or explicit Firebase usage.
- Authentication, account, admin, checkout, or API routes in this application.

## Required browser verification

1. Run production site in clean browser profile with DevTools Network and Application panels open.
2. Record every `Set-Cookie`, cookie, local/session storage key, third-party request, request purpose, and initiator before interaction.
3. Repeat after theme change, terminal use, sidebar toggle, and each external-link click.
4. Verify deployed environment variables and CDN/WAF headers; source inspection cannot establish retention, transfers, or vendor configuration.
