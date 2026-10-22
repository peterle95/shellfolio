# Showcase performance budgets and evidence: #39

Follow-up to [#37](https://github.com/peterle95/shellfolio/issues/37), part of
[#33](https://github.com/peterle95/shellfolio/issues/33).

## Outcome

The owner approved the budgets below and the decision to **record breaches
without raising the limits to force a pass**. The saved-report gate returns
**exit 1 / `budgetStatus: breach` with 13 timing breaches**. All three transfer
budgets pass at all viewports. This completes the budget/evidence work, not a
performance-compliance or optimization claim. #42 retains the profiling work.

Both fresh production builds, independent typechecks, eight CLI tests, the full
production project browser suite and terminal/badge/Grainient checks passed.
The new CLI/test files pass focused ESLint. Repository-wide lint still reports
**80 errors and 7 warnings**, tracked separately in #41. No application code,
dependencies or approved media changed.

## Approval and scope

The owner first approved collecting ten runs per viewport under the #37
conditions, then approved the numerical limits and comparison rules after
reviewing the results. The
[recorded owner decision](https://github.com/peterle95/shellfolio/issues/39#issuecomment-6339734130)
and [machine-readable budgets](project-performance-budgets.json) define the scope.
Apply absolute maxima independently at each viewport; equality passes. Baseline
deltas remain informational. Do not round samples before comparing them.

This work preserves the original captures and repeats the production comparison.
Application profiling belongs to #42; replacement media belongs to #43. The
approved shared Finance Tracker poster and silent clip remain unchanged.

## Revisions and conditions

- Baseline: `c9922bde43836a370ed426b13d93bb805f1ce1ab` (pre-showcase).
- Showcase: `dc0f1e60c404e256c74a8c7b6729b0e3f72290c1` (#35 and #36).
- Measurement scripts: `088424942f6196a784c7e78623d34e83e258cd5d` (#37), unchanged.
- Separate clean detached worktrees, lockfile installs and fresh production
  builds. Use the verification checkout's Playwright for both targets.
- 390, 900 and 1600px wide, 900px high, DPR 1, reduced motion, fresh browser
  context per run, browser cache disabled, 4x CPU slowdown, 80ms network latency,
  200,000 bytes/s down and 93,750 bytes/s up. Ten runs per width per target.
- Warm server/optimizer caches before measuring. Run the targets one at a time,
  without concurrent builds, tests or browser checks. Decline optional telemetry.
- Seed five `pwd` commands, then measure `projects`, `pwd`, `portfolio`, `about`,
  `projects`, `contact`, `projects`. Retain the earlier rendered outputs.
- Only the showcase has the extra explicit-Play phase, with input and two
  commands during the real throttled video transfer, followed by cleanup.

The host remains Windows 11 Home 10.0.26200 x64, Intel Core i7-1355U (10 cores /
12 logical processors), with Node 24.18.0, Next 16.3.0, Playwright 1.64.1 and
headless Chrome 155.0.8059.86. The baseline batch started at **10:54:59 UTC** and
the showcase batch at **11:04:13 UTC** on **2026-10-22**. No timed batch overlapped
builds, tests or another benchmark. Host power/thermal state and external
scheduling were not controlled.

## Approved budgets and results

Times are rounded ms for display; bytes are exact. **Bold** values exceed the
approved limit. The [JSON summary](evidence/projects-39/rerun-39/summary.json)
contains unrounded values and all 13 violations.

| Metric | Maximum | 390px | 900px | 1600px |
| --- | --- | --- | --- | --- |
| Journey input p95 | 200ms | 155 | 168 | 174 |
| First Projects median | 1500ms | **1733** | 971 | **2215** |
| Repeated Projects median | 500ms | **634** | 345 | **735** |
| About/Contact restoration p95 | 1000ms | 643 | 698 | **1047** |
| Loading input p95 | 200ms | 176 | **233** | **237** |
| Loading command p95 | 500ms | **554** | **777** | **584** |
| Play-to-first-`playing` p95 | 2000ms | **2241** | **3655** | **3122** |
| Pre-Play journey transfer max | 300000 bytes | 241758 | 250342 | 278620 |
| Optimized approved poster body max | 20000 bytes | 4882 | 13464 | 10204 |
| Total video transfer max per run | 3500000 bytes | 3062053 | 3062053 | 3062053 |

Each viewport/target contributes **480** journey input events, **10** first
Projects commands, **30** repeated Projects commands and **20** section
restorations. The showcase also contributes **140** loading input events,
**20** loading commands and **10** startup observations per viewport. Pool
samples within a viewport, never across widths. Nearest-rank p95 of ten startup
or first-Projects observations is the observed maximum; this does not establish
a population p95.

The common journey requests **zero videos in all 60 runs**. The showcase's
separate Play phase makes one successful 206 request per run: **3,061,715 body
bytes / 3,062,053 CDP transfer bytes**, using the approved silent MP4. Cleanup
releases the source without starting another request. Actual playback and the
separate delayed/broken-media checks preserve card height (**0px change**).
All runs record zero non-recent-input shift sums; these are not Web Vitals CLS.

Poster totals include only the approved `/_next/image` poster response, excluding
badge textures and other unrelated images. CDP transfer totals include response
overhead; poster body sizes do not. Initial-page attribution can vary with late
chunk completion, so the byte gate uses the settled pre-Play journey instead.

## Matched before/after comparison

The common journey's medians are **before → after**, in ms. Input lists
**p50 / p95**; restoration lists p95. FCP and page load remain observational,
outside the approved numerical gate.

| Width | FCP | Page load | Input p50 / p95 | First Projects | Repeated Projects | Restoration p95 |
| --- | --- | --- | --- | --- | --- | --- |
| 390 | 1418 → 1358 | 2887 → 2719 | 56 / 165 → 44 / 155 | 951 → 1733 | 333 → 634 | 501 → 643 |
| 900 | 1584 → 1272 | 3538 → 2311 | 57 / 164 → 38 / 168 | 1053 → 971 | 290 → 345 | 481 → 698 |
| 1600 | 1254 → 1116 | 2825 → 2313 | 39 / 132 → 73 / 174 | 800 → 2215 | 219 → 735 | 442 → 1047 |

### Variation

Each cell gives **min–max / p95**, rounded ms. First Projects has ten samples;
repeated Projects has thirty. Read the per-run values and tails alongside the
medians. At 900px the lower first-Projects median coexists with a 3430ms tail.
The results do **not** establish a general speedup or isolate a root cause.

| Width / target | First Projects | Repeated Projects |
| --- | --- | --- |
| 390 / Before | 220–1257 / 1257 | 41–637 / 624 |
| 390 / After | 526–2021 / 2021 | 126–1116 / 984 |
| 900 / Before | 789–1395 / 1395 | 79–659 / 652 |
| 900 / After | 573–3430 / 3430 | 136–1511 / 1342 |
| 1600 / Before | 278–1165 / 1165 | 67–496 / 421 |
| 1600 / After | 478–2860 / 2860 | 190–1878 / 1471 |

### Per-run command results

Tuples are **first Projects / repeated-Projects median / Contact**, rounded ms,
in execution order. Each repeated median uses that run's three later Projects
commands. The raw JSON retains every input, command, load and request sample;
the derived summary includes per-run distributions for each reported metric.

| Width / run | Before | After |
| --- | --- | --- |
| 390 / 1 | 865 / 245 / 347 | 1741 / 968 / 435 |
| 390 / 2 | 964 / 250 / 343 | 2021 / 574 / 421 |
| 390 / 3 | 939 / 361 / 426 | 1129 / 198 / 275 |
| 390 / 4 | 220 / 88 / 270 | 526 / 175 / 344 |
| 390 / 5 | 782 / 624 / 369 | 1951 / 938 / 638 |
| 390 / 6 | 1086 / 323 / 350 | 1747 / 804 / 431 |
| 390 / 7 | 922 / 302 / 319 | 1308 / 706 / 643 |
| 390 / 8 | 1023 / 361 / 367 | 1730 / 487 / 584 |
| 390 / 9 | 1257 / 457 / 385 | 1736 / 855 / 597 |
| 390 / 10 | 964 / 384 / 406 | 1131 / 332 / 237 |
| 900 / 1 | 994 / 358 / 373 | 573 / 254 / 366 |
| 900 / 2 | 1395 / 398 / 411 | 583 / 143 / 262 |
| 900 / 3 | 789 / 263 / 361 | 605 / 175 / 284 |
| 900 / 4 | 1112 / 330 / 471 | 582 / 147 / 265 |
| 900 / 5 | 1277 / 458 / 416 | 607 / 181 / 266 |
| 900 / 6 | 929 / 270 / 326 | 2382 / 465 / 418 |
| 900 / 7 | 1112 / 270 / 260 | 1335 / 438 / 447 |
| 900 / 8 | 869 / 256 / 327 | 3430 / 1342 / 363 |
| 900 / 9 | 832 / 263 / 297 | 2552 / 1168 / 808 |
| 900 / 10 | 1127 / 241 / 264 | 2535 / 627 / 475 |
| 1600 / 1 | 781 / 235 / 281 | 1807 / 608 / 654 |
| 1600 / 2 | 1100 / 277 / 279 | 2789 / 1218 / 1004 |
| 1600 / 3 | 886 / 78 / 178 | 2785 / 970 / 972 |
| 1600 / 4 | 604 / 89 / 185 | 1401 / 601 / 294 |
| 1600 / 5 | 278 / 83 / 175 | 2325 / 701 / 754 |
| 1600 / 6 | 398 / 149 / 505 | 1785 / 724 / 618 |
| 1600 / 7 | 1079 / 421 / 442 | 2105 / 312 / 979 |
| 1600 / 8 | 679 / 180 / 293 | 478 / 673 / 1017 |
| 1600 / 9 | 818 / 198 / 302 | 2860 / 1425 / 1342 |
| 1600 / 10 | 1165 / 306 / 417 | 2798 / 1392 / 1047 |

## Evidence

[Downloadable, versioned captures](evidence/projects-39/README.md) include the
original #37 JSON and screenshots. Keep those three-runs-per-viewport captures
separate from this ten-run rerun; do not pool them as one experiment.

An initial baseline batch stopped after 28 runs when both detached server
processes disappeared. Neither server logged a crash; the exact cause remains
unknown. The evidence directory retains that failed log and its warm-ups, but
the report excludes its incomplete timings. The replacement server sessions
use tool-managed lifetimes, followed by new warm-ups and a full restart of the
baseline batch. This infrastructure interruption does not establish an
application regression.

## Reproduce

Create two detached worktrees at the revisions above. In each worktree run
`npm ci` and `npm run build`, then start its production server:

```sh
# baseline worktree
npm run start -- --hostname 127.0.0.1 --port 9391
# showcase worktree
npm run start -- --hostname 127.0.0.1 --port 9390
```

From the verification checkout, warm each target with `--runs=1 --widths=390`,
then run the full comparisons in sequence:

```sh
npm run benchmark:projects -- --url=http://localhost:9391 --baseline --runs=1 --widths=390 --revision=c9922bde43836a370ed426b13d93bb805f1ce1ab --report=<warm-before.json>
npm run benchmark:projects -- --url=http://localhost:9390 --runs=1 --widths=390 --revision=dc0f1e60c404e256c74a8c7b6729b0e3f72290c1 --report=<warm-after.json>
npm run benchmark:projects -- --url=http://localhost:9391 --baseline --runs=10 --revision=c9922bde43836a370ed426b13d93bb805f1ce1ab --report=<before.json>
npm run benchmark:projects -- --url=http://localhost:9390 --runs=10 --revision=dc0f1e60c404e256c74a8c7b6729b0e3f72290c1 --report=<after.json>
```

`--revision` labels the target; it does not change the server's checkout.
Use the same browser executable for both targets (`BROWSER_PATH` if needed).

## Future budget checks

The owner approved testing the saved-report CLI boundary and retaining the
existing production browser checks. To summarize saved captures without a budget
verdict:

```sh
npm run check:projects-budget -- --before=<before.json> --after=<after.json> --report=<summary.json>
npm run test:projects-budget
```

The CLI reports each viewport's sample count, minimum, median (middle-pair mean
for even samples), nearest-rank p95 and maximum. It rejects different browser,
Node, platform or test conditions, missing/duplicate runs, incomplete journeys,
missing real-loading input/command samples and incomplete journey transfers.
Transfer snapshots must be nonempty and match the retained timestamped request
trace before Play (the complete trace for the baseline). Missing records must
produce invalid evidence, not a zero-byte budget pass.
Without `--budgets=<approved.json>`, it reports `not-evaluated` and exits zero
only to indicate a valid summary. That exit code alone is **not** a budget pass.

With an approved limits file, the CLI checks absolute maxima independently at
each viewport. Equality passes; any excess produces `budgetStatus: breach` and
exit code 1, with the metric, width, measured value and maximum. Invalid evidence,
unknown metric names or an incompatible approved environment produce exit code
2. Exit zero with `budgetStatus: pass` means the numerical check passed. Compare
unrounded samples; baseline deltas remain informational. Match the recorded host
hardware and record power/thermal differences as well: the capture records
platform, browser and test conditions, not a hardware or power attestation.

Run the approved check on this evidence:

```sh
npm run check:projects-budget -- --before=docs/evidence/projects-39/rerun-39/before.json --after=docs/evidence/projects-39/rerun-39/after.json --budgets=docs/project-performance-budgets.json --report=<budget-result.json>
npm run test:projects -- --url=http://localhost:9390 --screenshots=<directory>
```

The first command intentionally returns **1** for the current 13 breaches. Do
not suppress that status in a future gate, reinterpret `not-evaluated` as a pass,
or combine the old three-run captures with the approved ten-run environment.
The browser command must pass independently. It covers delayed/failed delivery,
geometry, navigation and cancellation beyond the saved numerical samples.

For a future revision, make fresh matched builds, use the unchanged workload,
label each actual server revision, preserve raw artifacts and rerun the gate.
Flag exit 1 as a budget failure and link its violations from the issue/CI result.
Treat exit 2 as invalid evidence requiring a corrected rerun, never compliance.
Changing the host/browser, workload, statistics, limits or approved media scope
requires a documented owner decision, not a silent config edit. The config's
approval reference records the human decision; the CLI does not authenticate it.

Keep the production browser suite alongside numerical checks: a low timing or
byte count does not prove zero video requests before Play, stable delayed-media
geometry or resource cleanup. A future run must pass both checks before anyone
claims compliance with the agreed scope.

## Regression checks

After measurements, the full production browser suite passed against the clean
showcase build. It captured new screenshots at 390, 900 and 1600px; those three
Projects views were visually inspected. The suite also covers native playback,
keyboard controls, delayed/failed delivery, source cleanup, responsive/optional
media, virtual project records and history. Immediate post-reload recall remains
the known separate #40 limitation; this work does not claim to repair it.

```sh
npm run typecheck
npm run test:projects-budget
node scripts/terminal-check.cjs
node scripts/badge-check.cjs
node scripts/grainient-check.cjs
node node_modules/eslint/bin/eslint.js scripts/projects-budget-check.cjs scripts/projects-budget-check.test.cjs
```

Both clean target builds used `npm ci` and `npm run build`, followed by
`node node_modules/typescript/bin/tsc --noEmit` in each worktree. Next's build
skips type validation, so the independent checks matter. The clean installs
reported 115 existing dependency audit advisories, including four critical;
no dependency remediation ships here.

## Interpretation and limits

Input-event-to-two-animation-frame and Enter-to-rendered-history-plus-two-frame
timings are diagnostic proxies, **not INP**, hardware key-to-screen latency or
production latency guarantees. Use nearest-rank p95 and report the sample count.
Shift sums include expansion, restoration and scrolling; they are **not Web
Vitals CLS**. Keep zero pre-Play video requests, reserved media geometry and
playback cleanup as separate functional requirements.

Local headless desktop Chromium, resized viewports and reduced motion do not
establish Safari, Firefox, physical-phone, native mobile fullscreen or normal-
motion GPU behavior (#38). Warm local servers do not measure CDN delivery.
Host scheduling, thermal state and asynchronous chunk completion limit the
comparison. All seven entries reuse one approved media URL; distinct future
assets need fresh transfer measurements.
