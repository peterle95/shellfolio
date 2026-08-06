# Ticket 15: EU Cookie Consent Requirements

Research snapshot: 2026-08-06. Legal implementation notes, not legal advice.

## Findings

- **Prior blocking.** ePrivacy Directive 2002/58/EC art. 5(3) requires prior informed consent before storing information in, or accessing information from, a user's terminal equipment, unless one of its limited exceptions applies. Do not load optional analytics, advertising, personalization, social/embed tags, pixels, fingerprinting, or equivalent local storage before consent. Consent for device storage does not automatically resolve GDPR lawfulness for later personal-data processing.
- **Strictly necessary exception.** Storage/access is exempt only when strictly necessary to provide a service explicitly requested by the user, or solely to carry a communication. Typical candidates: session/authentication, load balancing, security state, shopping basket, consent preference state, and user-requested feature state. Classify each technology by purpose, lifetime, domain, vendor, and data flow. A technology useful to the operator but not necessary to deliver the requested page/service is not exempt.
- **Consent quality.** GDPR arts. 4(11), 6(1)(a), and 7 require a freely given, specific, informed, unambiguous indication by clear affirmative action. No pre-ticked optional controls, implied consent from continued browsing, silence, cookie walls, or bundled purposes. Provide separate choices for materially different purposes/vendors where needed. EDPB Guidelines 05/2020 treats consent as an active choice and says withdrawal must be as easy as giving consent.
- **Refusal.** Show an equally prominent reject/no-thanks route at the initial layer. Refusal must not trigger optional tags or degrade access to unrelated content. Re-prompting cannot pressure users into acceptance; respect a recorded refusal for a reasonable period and define that period in the notice/configuration.
- **Withdrawal and change.** Provide a persistent, keyboard-accessible “privacy/cookie settings” control. Withdrawal must stop future optional storage/access and downstream processing, delete or expire optional client identifiers where feasible, and propagate the change to vendors. Existing data may require deletion or another documented lawful basis. Keep strictly necessary preference storage so refusal/withdrawal remains enforceable.
- **Information.** GDPR arts. 12-13 and ePrivacy art. 5(3) require clear, comprehensive information before consent: purposes, categories/technology names, first/third parties or vendors, duration/expiry, processing recipients, international transfers where relevant, and how to refuse/withdraw. Link the full privacy notice and a detailed cookie/technology list. Explain consequences without misleading “necessary” labels.
- **Evidence/accountability.** GDPR art. 7(1), art. 5(2), and art. 24 require the controller to demonstrate consent and compliance. Store a tamper-resistant preference record sufficient to reconstruct: anonymous/pseudonymous identifier, timestamp, consent version, jurisdiction/context, purposes/categories selected, displayed notice/configuration, choice, and withdrawal/refusal events. Do not make the evidence store itself depend on optional tracking. Maintain a technology/vendor inventory and change/re-consent procedure.
- **Accessibility.** Consent must be understandable and easily accessible under GDPR arts. 12 and 7(3). Implement with semantic controls, labels, focus management, keyboard-only operation, visible focus, sufficient contrast, no color-only choices, screen-reader announcements, responsive layout, and plain language. Test at 200% zoom and with assistive technology. WCAG 2.2 AA is a useful implementation benchmark; confirm any applicable national accessibility/public-sector rules separately.
- **Analytics, advertising, personalization, embeds.** Default all non-exempt categories off. Gate scripts, requests, iframe creation, image pixels, SDK initialization, and server-side forwarding, not merely their cookies. Use click-to-load placeholders for optional embeds. Vendor consent signals must match local choices and vendor purposes.
- **Security and abuse prevention.** Security controls can be strictly necessary only to the extent genuinely required to provide or protect the requested service. Minimize identifiers, retention, access, and reuse; document purpose. A broad persistent fingerprint or behavioral profile for general bot scoring is unlikely to be strictly necessary merely because it improves security. Analyze GDPR lawful basis, transparency, proportionality, and applicable national rules separately.

## Implementation minimum

1. Inventory every cookie, local-storage key, pixel, script, SDK, iframe, fingerprint signal, and server-side vendor flow.
2. Classify each as exempt strictly necessary or consent-required; record rationale and retention.
3. Block consent-required execution and network requests until an affirmative category choice.
4. Present Accept and Reject/no-thanks with equal prominence, plus granular settings and purpose-specific text.
5. Persist versioned choices, expose one-step settings access, honor withdrawal, and verify vendor stop/delete behavior.
6. Add automated checks that first-load requests contain no optional vendors and that withdrawal prevents reactivation.

## Primary sources

- GDPR Regulation (EU) 2016/679, official text: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- ePrivacy Directive 2002/58/EC, official text, art. 5(3): https://eur-lex.europa.eu/eli/dir/2002/58/oj
- EDPB Guidelines 05/2020 on consent under GDPR: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en
- ICO, Guidance on storage and access technologies, including exceptions, consent, records, withdrawal, and accessibility-related implementation: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-cookies-and-similar-technologies/
- CNIL, Cookies and other trackers guidance hub: https://www.cnil.fr/en/cookies-and-other-trackers
- Irish Data Protection Commission, Cookies guidance: https://www.dataprotection.ie/en/organisations/know-your-obligations/cookies
- W3C Web Content Accessibility Guidelines 2.2 (implementation benchmark, not regulator guidance): https://www.w3.org/TR/WCAG22/

## Unresolved jurisdictional questions

- Which Member State(s) are target users in, and where is the controller/establishment? National ePrivacy implementations and regulator expectations differ.
- Is UK traffic in scope? UK PECR/UK GDPR and ICO guidance apply separately; UK guidance currently includes additional statutory exceptions and should not be assumed to describe EU law.
- What exact technologies, vendors, purposes, retention, CDN/hosting, and international transfers exist? Strict-necessity classification cannot be finalized without this inventory.
- Is consent-or-pay, personalization, or service denial contemplated? Assess freedom of consent and any national regulator position before using a cookie wall.
- Are children likely users, or are special-category data, logged-in identity, or cross-device identifiers involved? This changes risk, information, minimization, and verification requirements.
- Which accessibility regime applies to this private website, if any? GDPR requires understandable/accessibility-friendly information, but sector, country, and service classification determine additional statutory duties.
- What retention period should refusal/consent evidence and preference cookies use? GDPR requires necessity/accountability, while national guidance may recommend different review intervals.
