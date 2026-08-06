# Ticket #16: Bot Mitigation Tradeoffs

## Finding

Use proportionate, route-specific defense in depth. Keep public, indexable content accessible; protect expensive or state-changing routes more strongly. No control proves a human perfectly.

| Option | Fit | Costs and risks | Fallback |
| --- | --- | --- | --- |
| CDN/WAF rate limits | Best baseline for login, search, form submission, API, and expensive routes. Cheap operationally; avoids user friction; can key by IP, path, headers, cookie, or account depending on platform. | Shared IPs, NAT, mobile networks, and distributed bots create false positives or bypasses. Counters are approximate and vendor limits/features vary by plan. | `429` with `Retry-After`, bounded backoff, monitoring-only rollout, and a narrowly scoped exception path. Never rate-limit verified search bots without SEO review. |
| Bot signals / risk scoring | Good for allow, monitor, throttle, or challenge decisions. Cloudflare scores 1-99 and uses headers, session, browser, and behavioral signals; AWS Bot Control labels bots and can use browser interrogation, fingerprinting, heuristics, and ML. | Probabilistic; vendor processing, cookies, fingerprints, logs, transfers, and retention require controller/processor review, notice, minimisation, and documented purpose. Paid tiers can be substantial. | Treat score as a signal, not sole denial rule. Log outcomes, tune thresholds, allow verified crawlers, and provide support/redress. |
| Managed challenge | Best escalation for suspicious browser traffic on selected HTML routes. Cloudflare recommends Managed Challenge; most humans pass automatically, while higher-risk clients may interact. | Breaks non-HTML/XHR flows, can loop, excludes JS-disabled/older clients, and can block assistive or privacy-oriented browsers. Third-party service/data-processing review required. | Challenge only browser entry page; issue a short-lived clearance/token for API calls. Offer accessible contact/manual review and fail closed only for high-risk actions. |
| JS challenge / proof of work | Useful as invisible signal gathering, not human proof. Proof-of-work consumes client CPU/battery and penalises low-power/accessibility devices; JS-disabled clients fail. | Browser fingerprinting and computational/device signals increase privacy and false-positive concerns. Attackers can automate browsers or pay compute; no durable identity. | Use only as low-friction step-up, cap work, time out, and fall back to rate limit or manual review. Do not require globally. |
| Authentication / MFA / passkeys | Strongest control for private or state-changing routes because it establishes account/session control, not “humanity.” Use route protection and least privilege. MFA/passkeys reduce credential abuse. | Adds account creation, recovery, support, accessibility, and personal-data burden; excludes anonymous users and search indexing. Account lockout can itself become DoS. | Keep public GET routes public; require auth only where business need exists. Use throttling, generic errors, recovery, and step-up auth for sensitive actions. |
| Route-specific protection | Recommended architecture: public content unchanged; rate-limit search/forms; challenge suspicious submissions; authenticate private/admin/API actions. | Requires inventory, telemetry, threshold tuning, and tests across crawlers, screen readers, JS-disabled clients, VPNs, and mobile networks. | Start observe-only, then throttle, then challenge/block; maintain emergency disable and support path. |

## Privacy and accessibility requirements

- Record vendor, controller/processor roles, purposes, data fields, locations/transfers, retention, subprocessors, cookies, and deletion/subject-rights handling before deployment. EDPB says measures must be risk-appropriate and data minimised; pseudonymised data remains personal data.
- Prefer first-party rate limiting and short-lived, essential security tokens. Do not reuse bot telemetry for analytics, advertising, or identity proofing without separate justification and notice.
- Challenge is not an accessibility exemption. Preserve keyboard, screen-reader, mobile, low-bandwidth, JS-disabled, and assistive-technology access; provide a non-CAPTCHA route or human support for failures. WCAG 2.2 is the relevant technical baseline.
- Preserve verified search-engine access and stable public URLs. Do not put blanket challenges in front of indexable content.

## Recommendation

1. Baseline: CDN/WAF route and method rate limits, with account-aware limits for authenticated actions and `429` retry behavior.
2. Add passive bot signals in observe mode; use them to target escalation, not blanket blocking.
3. Use managed, preferably non-interactive challenge only for elevated-risk browser requests to costly or abusive routes. Use pre-clearance/token flow for APIs.
4. Require authentication only for private/state-changing functionality; add MFA/passkeys or step-up for sensitive actions.
5. Measure false positives, solve rate, crawler coverage, accessibility failures, origin load, and vendor data/cost monthly. Keep manual fallback and kill switch.

## Sources

- Cloudflare rate limiting: https://developers.cloudflare.com/waf/rate-limiting-rules/
- Cloudflare bot scores and signals: https://developers.cloudflare.com/bots/concepts/bot-score/
- Cloudflare managed challenges and API limitation: https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/
- Cloudflare Turnstile, proof-of-work/signals, accessibility: https://developers.cloudflare.com/turnstile/
- Cloudflare Turnstile privacy addendum: https://www.cloudflare.com/turnstile-privacy-policy/
- AWS WAF rate-based rules: https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html
- AWS WAF Bot Control: https://docs.aws.amazon.com/waf/latest/developerguide/waf-bot-control.html
- EDPB, secure personal data and minimisation: https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en
- W3C WCAG 2 overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- NIST SP 800-63B authentication assurance and privacy: https://pages.nist.gov/800-63-4/sp800-63b.html
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Automated Threats: https://owasp.org/www-project-automated-threats-to-web-applications/
