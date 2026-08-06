# Privacy Verification Baseline

Verification date: 2026-08-06

Target: `https://petermoelzer-shellfolio.vercel.app/`

## Observed

- Initial `GET /` returned `200` from Vercel.
- Response had no `Set-Cookie` header.
- Server-rendered HTML includes Google Fonts preload, preconnects, and stylesheet:
  - `https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap`
  - `https://fonts.gstatic.com`
- No consent banner, settings control, or consent state is present in the current server-rendered HTML.
- Source inventory still applies: Vercel Analytics, Vercel Speed Insights, and conditional Microsoft Clarity are rendered or initialized by the application.

## Not yet verifiable

- Browser cookies and storage after hydration and interaction.
- Vendor request payloads, identifiers, retention, transfers, and dashboard configuration.
- Consent accept, reject, six-month expiry, and withdrawal behavior.
- Whether optional telemetry is blocked before consent.
- Production behavior after Google Fonts self-hosting.

## Conclusion

Current deployment is a baseline, not compliant implementation evidence. Consent controls and font self-hosting must ship before the runtime verification can be repeated.
