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

## Results

The clean detached worktree was installed with `npm ci --no-audit --no-fund`.
Its unchanged baseline independently reproduced **80 errors and 7 warnings**.
The cleanup has **0 errors and 0 warnings**, including with `--max-warnings=0`.
The lockfile, dependency versions, ESLint configuration and owner's local edits
are unchanged. Next's build automatically updates JSX/include settings only in
the disposable verification worktree; that generated diff is not committed.

### Retained, specific exceptions

- CommonJS imports in standalone Node `.cjs` checks: file-scoped exceptions,
  consistent with the pre-existing history/project checks. Application imports
  remain checked, and `tailwind.config.ts` now uses an ES import.
- `PrivacyConsent.tsx`: hydrate saved browser consent after the SSR-safe initial
  render without changing the site's existing defaults.
- `Telemetry.tsx`: initialize from browser consent before subscribing to changes;
  do not mount optional telemetry during SSR.
- `VisualEffects.tsx` (two sites): clear eligibility when Badge is excluded and
  clear readiness when its external renderer unmounts.
- `carousel.tsx`: read the external Embla selection state before subscribing.
- `use-mobile.tsx`: hydrate viewport state after the server-safe initial value.

Each effect exception is on one reported line with its reason. No type-check
suppression remains in Badge: props, physics refs, pointer capture, GLTF nodes,
and custom Fiber elements use concrete types. Texture configuration uses Drei's
post-commit setup callback. Stable material constructor arguments avoid renderer
recreation; texture transforms, curve type, physics and visual values are retained.

### Verification

Passed in the clean verification worktree:

```sh
npm run lint -- --max-warnings=0
npm run typecheck
npm run build
node --test scripts/history-store.test.cjs scripts/projects-budget-check.test.cjs scripts/ui-render.test.cjs
node scripts/terminal-check.cjs
node scripts/badge-check.cjs
node scripts/grainient-check.cjs
npm run start -- --hostname 127.0.0.1 --port 9401
# In a second terminal:
npm run test:projects -- --url=http://localhost:9401
node scripts/lint-browser-check.cjs --url=http://localhost:9401
```

- All 14 Node tests pass. The new server-render regression first failed on
  differing skeleton widths, then passed with deterministic per-instance widths.
- Full project browser coverage passes: responsive layouts, virtual files,
  command recall/reload, actual playback/resource cleanup and media failures.
- Additional Chrome 155 checks pass: unchanged consent defaults, Escape rejection,
  focus trapping, saved choices/reload, actual Badge WebGL readiness, resize, and
  reduced-motion teardown/re-enable. Texture setup and stable material arguments
  are also asserted by the Badge harness.
- Standards and Spec reviews against `5b15d33` each report zero findings.
- No performance measurements or broader cross-browser compliance claims.

The additional browser check exposed a pre-existing privacy focus-return bug:
the saved trigger is unmounted while settings are open, so synchronous focus
restoration targets a detached element. It is isolated as
[#44](https://github.com/peterle95/shellfolio/issues/44), not silently fixed or
counted as passing in this behavior-preserving lint cleanup. Consent focus
trapping and persistence are checked independently.
