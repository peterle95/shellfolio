# Repository lint cleanup (#41)

## Inventory and scope (before edits)

Baseline: `5b15d3337ac8b2092e6320274f6cf978ec5e872b`, Node 24.18.0,
npm 11.16.0, ESLint 9.39.5, eslint-config-next 16.3.4. A fresh
`eslint . --format json` run found **80 errors and 7 warnings**, matching the
historical #37 counts. No dependency or lint-configuration changes are planned.

| Rule | Errors | Warnings |
| --- | ---: | ---: |
| `@typescript-eslint/ban-ts-comment` | 28 | 0 |
| `@typescript-eslint/no-require-imports` | 17 | 0 |
| `@typescript-eslint/no-explicit-any` | 8 | 0 |
| `react-hooks/immutability` | 7 | 0 |
| `react-hooks/set-state-in-effect` | 7 | 0 |
| `react/no-unescaped-entities` | 7 | 0 |
| `@next/next/no-assign-module-variable` | 2 | 0 |
| `prefer-const` | 2 | 0 |
| `@typescript-eslint/no-this-alias` | 1 | 0 |
| `react-hooks/purity` | 1 | 0 |
| `@typescript-eslint/no-unused-vars` | 0 | 7 |

| File | Errors | Warnings |
| --- | ---: | ---: |
| `scripts/badge-check.cjs` | 6 | 0 |
| `scripts/grainient-check.cjs` | 6 | 0 |
| `scripts/terminal-check.cjs` | 6 | 1 |
| `src/components/MicrosoftClarity.tsx` | 1 | 0 |
| `src/components/PrivacyConsent.tsx` | 2 | 0 |
| `src/components/Telemetry.tsx` | 1 | 0 |
| `src/components/shellfolio/Badge.tsx` | 40 | 0 |
| `src/components/shellfolio/Iridescence.tsx` | 1 | 0 |
| `src/components/shellfolio/VisualEffects.tsx` | 2 | 0 |
| `src/components/shellfolio/outputs.tsx` | 5 | 0 |
| `src/components/shellfolio/terminal/TerminalWelcome.tsx` | 2 | 0 |
| `src/components/ui/carousel.tsx` | 1 | 0 |
| `src/components/ui/sidebar.tsx` | 1 | 0 |
| `src/hooks/use-mobile.tsx` | 1 | 0 |
| `src/hooks/use-toast.ts` | 0 | 1 |
| `src/lib/terminal/autocomplete-engine.ts` | 1 | 0 |
| `src/lib/terminal/command-registry.ts` | 0 | 1 |
| `src/lib/terminal/commands/cat.tsx` | 0 | 1 |
| `src/lib/terminal/commands/ls.tsx` | 0 | 3 |
| `src/lib/terminal/terminal-state.tsx` | 2 | 0 |
| `src/lib/terminal/virtual-filesystem.ts` | 1 | 0 |
| `tailwind.config.ts` | 1 | 0 |

## Reviewable batches

1. Mechanical fixes: unused declarations, constant/import spelling, JSX escaping,
   and standalone CommonJS harness conventions. No command/output changes.
2. Effect/render correctness: declaration order, browser-state hydration and
   subscriptions, and stable sidebar skeleton width. Preserve initial SSR state,
   consent defaults, history persistence, and graphics eligibility/lifecycle.
3. Badge typing and imperative renderer setup: replace unchecked types and TS
   suppressions with installed Three/Fiber/Rapier/meshline types; move renderer
   mutations out of render. Keep physics, asset paths, and visual parameters.

These groups are small enough for separate commits within #41; no independent
feature or performance work is included. Owner edits to documentation, TypeScript
configuration and media are excluded. A detached clean worktree with `npm ci`
will verify the committed tree, including the media absent in the owner's local
working tree.

## Exception policy and validation

No global rule suppression. The existing `.cjs` harness convention permits a
file-scoped, explained `no-require-imports` exception for Node's standalone
CommonJS scripts. Browser-only initial snapshots may retain a **line-scoped**
`set-state-in-effect` exception with a concrete hydration/subscription reason;
do not redesign state ownership or defer work merely to evade lint.

Use focused lint and typechecks between batches. Final checks: repository-wide
lint, independent typecheck, production build, history and budget tests, terminal,
Badge and Grainient harnesses, and the production project browser suite. The user
approved existing browser/script seams and review against `5b15d33`.
