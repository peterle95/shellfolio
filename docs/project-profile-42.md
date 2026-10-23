# Desktop project rendering profile: #42

Investigation for [#42](https://github.com/peterle95/shellfolio/issues/42),
part of [#33](https://github.com/peterle95/shellfolio/issues/33), following
[#37](project-verification-37.md) and [#39](project-performance-39.md).

## Scope

This is a production-runtime investigation, not an application optimization.
The target revisions remain the pre-showcase
`c9922bde43836a370ed426b13d93bb805f1ce1ab` and showcase
`dc0f1e60c404e256c74a8c7b6729b0e3f72290c1`. Current owner media edits are
not part of either target. The budget decision from #39 remains in force;
profiling does not waive its timing breaches.

## Outcome

**Layout is the strongest measured first-Projects cost; repeated output also
spends more time in rendering JavaScript and synchronous scroll-triggered
layout. Restoration adds layout and paint despite fewer retained elements than
the baseline.** Loading contributes, but the command chunks finish well before
the slow command proxies end. No video is requested in any measured run.

The original **2382ms Contact outlier did not recur**: showcase Contact ranges
from **428 to 785ms** in these ten runs (baseline 238–574ms). #39 independently
observed 1342ms at desktop; neither cohort reproduces 2382ms. This does not
exclude rarer tails, and traced timings do not replace the #39 budget gate.
No application optimization, media change or budget adjustment ships here.

## Measured command latency

Values are rounded milliseconds from the page proxy. Medians pool only the
specified commands; p95 uses nearest rank, so ten-sample p95 is the maximum.
Capture starts: baseline **10:14:37 UTC**, showcase **10:18:58 UTC**.

| Metric / sample count per target | Before | After |
| --- | ---: | ---: |
| First Projects median / 10 | 930 | 1250 |
| Repeated Projects median / 30 | 258 | 456 |
| Repeated Projects p95 / 30 | 418 | 883 |
| About + Contact restoration median / 20 | 302 | 508 |
| About + Contact restoration p95 / 20 | 574 | 733 |
| Contact median / 10 | 293 | 526 |
| Contact maximum / 10 | 574 | 785 |

Per-run tuples are **first Projects / repeated-Projects median / Contact**.
The [raw captures](evidence/projects-42/README.md) retain all seven command
timings and every individual input event, not just these summaries.

| Run | Before | After |
| --- | --- | --- |
| 1 | 818 / 376 / 574 | 1397 / 370 / 785 |
| 2 | 1210 / 389 / 540 | 1639 / 480 / 505 |
| 3 | 1073 / 334 / 238 | 2084 / 413 / 733 |
| 4 | 1321 / 364 / 514 | 1251 / 630 / 518 |
| 5 | 1104 / 208 / 474 | 1248 / 535 / 659 |
| 6 | 1041 / 236 / 268 | 1245 / 465 / 561 |
| 7 | 589 / 255 / 284 | 1134 / 442 / 505 |
| 8 | 685 / 371 / 302 | 1153 / 499 / 511 |
| 9 | 633 / 190 / 273 | 1313 / 466 / 428 |
| 10 | 638 / 176 / 259 | 1022 / 444 / 534 |

## Trace findings

### Rendering, layout and paint

Median clipped wall-time event unions, **before → after**, in ms. These are
renderer-thread trace durations, **not exclusive CPU buckets**. In particular,
JS-inclusive slices can contain layout; do not add columns or subtract their
medians from the command median to infer an unexplained remainder.

| Command group | JavaScript inclusive | Layout | Style update | PrePaint / Paint / Layerize |
| --- | --- | --- | --- | --- |
| First Projects / 10 | 246 → 391 | 183 → 586 | 49 → 24 | 239 → 133 |
| Repeated Projects / 30 | 180 → 352 | 31 → 128 | 38 → 10 | 60 → 69 |
| About / 10 | 118 → 139 | 20 → 114 | 21 → 31 | 57 → 74 |
| Contact / 10 | 96 → 130 | 19 → 93 | 19 → 26 | 70 → 178 |

Compilation slices are approximately 0–1ms at the group medians, not the
dominant first-use cost. JavaScript includes React/effects and benchmark
callbacks; these totals alone do not identify an expensive React component.

All ten traces per target show a synchronous layout stack on `pwd` and each
repeated Projects command (40 stacks per target). Showcase repeated-Projects
stacks point to shipped chunk `1y28p4907gvx8.js`, line 1, column 13814;
`pwd` points to column 13901. The preserved
[chunk identity and excerpts](evidence/projects-42/shipped-scroll.json) map
these to `TerminalViewport`'s first-card bounding-rectangle reads and
`scrollHeight` read respectively. The baseline has the corresponding
`scrollHeight` stack at `3ihezsi0z91_0.js:1:12856`.
This is direct evidence of synchronous layout in the scroll effect, **not**
proof that removing one read saves the whole measured layout duration.
First Projects and restoration layout events do not supply those stacks;
do not attribute their entire cost to that effect.

### Loading

The first Projects command requests a baseline command chunk of 804 transfer
bytes versus 7704 after, plus 1191 CSS bytes after. Across runs, its JS request
finishes **125–200ms after Enter before**, **159–181ms after Enter after**.
Showcase first-Projects proxies still range from 1022–2084ms. The optimized
10,204-byte poster body is requested late in first rendering and is asynchronous;
the terminal does not wait for video delivery. Every run passes the zero-video
request assertion before Play (this cohort never plays).

About/Contact first-use chunks also grow: 1344/809 transfer bytes before,
7692/7707 after. Showcase requests finish 148–174ms / 139–175ms after Enter;
rendering continues after delivery. Repeated Projects starts no new command
chunk requests in the recorded windows. Thus loading is a real first-use
contributor, but not a sufficient explanation for the repeated-render cost or
the full first-use/restoration delay. Request completion can precede delivery
of the `responseReceived` protocol notification; use the retained loading-end
timestamp, not notification order, for these spans. Network waits overlap
renderer work and must not be added to the trace category columns.

### Retained-history work

Attached element counts are stable across the ten runs at each journey stage.
After first Projects the baseline/showcase have **341/290** attached elements;
after four project outputs they have **1029/843**. The showcase keeps
**7 → 14 → 21 → 28** articles, not just the latest seven. At Contact it still
retains 21 articles. Fewer elements do **not** mean cheaper rendering: nested
grids, container-query layout, images and controls differ from JSON output.

Source at the target revision explains a plausible interaction:
`PortfolioLayout.tsx:15` restores the desktop spacer when leaving Projects;
`ProjectsOutput.module.css:140-149` switches card content/columns by container
width; old output remains in `TerminalInteractiveViewport.tsx:15-32`.
The traces measure higher restoration layout/paint, but **do not isolate** how
much is old-card reflow, newly inserted output, container-query work or static
badge/layout restoration. There is no matched history-cleared ablation here.
Node totals and layout-object counts are different inventories, not timings
or a causal memory-leak test. Repeated costs are variable, not monotonically
increasing in every run.

## Recommendation and remaining uncertainty

Recommend a **separately approved, bounded scroll-positioning experiment** at
`TerminalViewport`'s existing effect: preserve first-card positioning and
ordinary bottom scrolling, but test post-layout positioning rather than forcing
geometry during the effect. The repeated-command stacks support this narrow
starting point; baseline also has synchronous layout, so do not assume this
alone removes the showcase delta. Check whether a post-layout observer avoids
an extra flush rather than merely moving the same work. Do not replace the
reads with another synchronous geometry API and call that an optimization.

Evaluate the experiment against the untraced #39 budgets and these trace
windows, with retained history, restoration, keyboard scrolling and lazy media
checks intact. First-Projects layout remains a separate measured cost if the
scroll experiment does not reduce it. A CSS/card-layout experiment can follow
only with its own scope and evidence; a virtualizer, history deletion, context
rewrite or media platform is not justified by this investigation.

This is a recommendation, **not approval to implement**, an acceptance of the
existing timing breaches, or a guaranteed saving. Rarer Contact tails, other
browser engines, real devices, animation-enabled badges, GPU time and current
owner-specific replacement assets remain uncharacterized. The original
2382ms event has no retained trace here, so its exact cause is unresolved.

## Conditions and sample plan

Fresh production builds on 2026-10-23, headless Chrome 155.0.8059.86 via
Playwright, Node 24.18.0, Windows x64. The two existing detached profiling
checkouts have only Next-generated `tsconfig.json` changes; application files
remain at the named revisions. Their existing independent lockfile installs
were reused; neither target uses the owner's current working tree or media.

Ten fresh browser contexts per target, sequential baseline then showcase, at
1600×900, DPR 1, reduced motion, cache disabled, 4× CPU slowdown, 80ms latency,
200,000 bytes/s download and 93,750 bytes/s upload. Optional telemetry declined.
Server and image-optimizer caches warmed with one excluded desktop journey
per target. Each measured run seeds five `pwd` commands and then executes
`projects`, `pwd`, `portfolio`, `about`, `projects`, `contact`, `projects`,
settling network activity after each. No Play action occurs in this cohort.
This supplies ten first Projects, thirty repeated Projects, ten About and
ten Contact observations per target, with twenty complete traces in total.

The reduced-motion setting disables the animated badge enhancement; badge
restoration here is the static badge/layout path, not WebGL/physics startup.
This is not evidence about animation-enabled badge performance.

## Reproduce

Use the separate detached checkouts and lockfile installations described in
[#37](project-verification-37.md#reproduce). Build both targets fresh, then
start their production servers on ports 9421 (before) and 9420 (after).
Run one warm-up journey per target before collecting the batches. Keep builds,
tests and other browser measurements out of the measurement interval.

```sh
node scripts/projects-benchmark.cjs --url=http://localhost:9421 --baseline --runs=10 --widths=1600 --journey-only --revision=c9922bde43836a370ed426b13d93bb805f1ce1ab --trace-dir=docs/evidence/projects-42/traces --report=docs/evidence/projects-42/before.json
node scripts/projects-benchmark.cjs --url=http://localhost:9420 --runs=10 --widths=1600 --journey-only --revision=dc0f1e60c404e256c74a8c7b6729b0e3f72290c1 --trace-dir=docs/evidence/projects-42/traces --report=docs/evidence/projects-42/after.json
```

Run commands sequentially, not concurrently. `--revision` labels the target;
it does not select a checkout. `--journey-only` omits the separate explicit-Play
phase, not any common-journey command. With neither new option supplied, the
existing benchmark journey and playback checks remain enabled.

## Evidence interpretation

Each gzip trace is a Chrome trace-event JSON file. Decompress and load it in
Chrome DevTools Performance to inspect `command-5-projects` through
`command-11-projects` in User Timing alongside the renderer main-thread flame
chart, layout/paint events, loading events and sampled JavaScript stacks.
Commands 0–4 are the five `pwd` history seeds. Tracing covers navigation and
the whole journey, including typing and network settlement between commands.

The JSON command proxy is still Enter to observed history insertion plus two
animation frames, not INP or hardware key-to-screen latency. User Timing
measures bracket the same event window. Per-command `commandWork` records CDP
Performance counter deltas taken after typing and around execution, followed
by a post-proxy DOM inventory. Those CDP windows are wider than the User Timing
windows: polling/protocol overhead must not be reported as application cost.
Duration counters use seconds; `Timestamp` is elapsed time, not CPU time.
`ScriptDuration` includes rendering JavaScript, not just command handlers;
`TaskDuration` includes other main-thread tasks. These overlapping counters
are not additive with trace layout/paint slices. Counter node deltas can
include detached nodes; `dom.nodes` counts attached elements instead.

This diagnostic trace cohort must not be pooled with untraced #37/#39 budget
measurements. Stack sampling, instrumentation and CDP snapshots introduce
overhead. Local Windows host scheduling, power and thermal state are not
controlled, and ten runs cannot establish a population tail percentile.
The captured files do not retain Chrome's tracing-completion buffer-loss flag;
marker coverage and per-window sanity checks are verified, but lossless capture
of every profiler event is not independently established. Garbage collection,
GPU/raster work, browser-process work and unattributed scheduling delay are not
allocated to application functions by the derived category totals.

## Verification boundary

The approved primary seam in #33 is the rendered page and its observable
network/resource effects. This investigation retains that seam: the existing
benchmark checks rendered-history progress, zero pre-Play video requests and
absence of page errors; the trace path additionally requires a first-Projects
marker. The summary requires all seven journey markers per run, checks their
durations against the page proxy within 5ms and bounds every category union
by its marker window. No application behavior is changed, so no application
test-first failure/fix cycle is claimed.
