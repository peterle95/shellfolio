# Responsive project cards: issue #35

Implementation and verification for [#35](https://github.com/peterle95/shellfolio/issues/35),
part of [#33](https://github.com/peterle95/shellfolio/issues/33).

## Delivered scope

- The Projects button, `projects`, and `portfolio` use the same output and
  provider-owned active section. Projects expand the terminal within its
  existing page container and remove the decorative badge. Other sections,
  including their aliases, restore the normal layout without removing history.
  Ordinary shell commands do not change the active section; reset/clear exits it.
- The [approved #34 handoff](project-content-34.md) supplies every short
  description and the shared Finance Tracker still image, including More
  Projects. The approved exception supersedes the original no-placeholder gate.
  Every preview explicitly says it is a shared placeholder, not that project's
  screenshot. No video element, Play control, or video source ships in this slice.
- Container queries switch from short descriptions to unchanged full descriptions
  and stacks at 36rem of available content width. Two-column rows start at 52rem,
  retaining at least about 350px for each text column at the tested transition.
  The renderer uses the available terminal width, including when older outputs
  remain visible after the layout is restored.
- Next's existing local image optimizer supplies responsive WebP delivery.
  Images have approved alternatives, intrinsic dimensions, reserved aspect
  ratios, and native lazy loading. An image failure retains its reserved space
  and leaves the text and links usable. Entries without an image have no media
  column or empty preview box.
- New project outputs scroll to their first card inside the terminal, not past
  the entire showcase to the prompt. Preview/link clicks do not refocus the
  prompt. Empty-prompt Tab navigation and a keyboard-focusable scroll region
  allow keyboard access to links and retained history.
- Existing ordering, titles, desktop descriptions, stacks, valid link meanings,
  virtual filenames, and serialized project records are preserved. Other
  sections still use the unchanged structured-record renderer.

No runtime dependency, media service, generated project screenshot, or change
to the original owner video was needed. Playwright is a development-only
dependency for the requested browser checks. Playback remains a dependent slice.

## Reproduce

Use Node 20+ and either an installed Playwright Chromium
(`npx playwright install chromium`) or set `BROWSER_PATH` to Chrome/Edge. The
scripts also detect standard Chrome/Edge installation paths on Windows.

```sh
npm ci
npm run build
npm run start -- --port 9350
```

In another terminal:

```sh
npm run typecheck
node scripts/terminal-check.cjs
node scripts/badge-check.cjs
node scripts/grainient-check.cjs
npm run test:projects -- --url=http://localhost:9350
npm run benchmark:projects -- --url=http://localhost:9350 --report=after.json
```

`test:projects` also accepts `--screenshots=<directory>`, capturing 390px,
900px, and 1600px presentations. Use a production server, not the development
server, for responsive-image and transfer comparisons.

## Verification on 2026-10-22

Passed production build, independent typecheck, all three existing regression
scripts, and the new browser check using Chrome 155.0.8059.86 on Windows.

Browser coverage:

- All three navigation methods; repeated project outputs; restoration through
  About, Education, Work, CV, Contact, Credentials, Help, and section aliases;
  retained outputs and terminal width/badge changes.
- 320, 390, 768, 900, 945, 960, 1024, 1399, 1400, and 1600px viewports:
  exact short/full copy, stacks, ordering, real links, media, readable column
  widths, reserved image geometry, and no horizontal overflow.
- Internal scrolling to the first card, repeated-output scroll positioning,
  keyboard scrolling, native link focus/activation, and no preview-click jump
  to the prompt.
- Images held pending while typing and executing `pwd`; successful loading
  and request failures both preserve card height. Broken media leaves copy and
  repository navigation available.
- Actual production image requests select `w=384` at 390px, `w=828` at 900px,
  and `w=640` at 1600px (DPR 1). No MP4/WebM request occurs, including after
  repeated project commands.
- A browser fixture renders the same production component and CSS with media
  omitted: text spans the entire row, with no figure or placeholder links.
  This is fixture coverage because the approved release has images on all seven
  entries. A longer image fixture appends distinct cache-key parameters to real
  optimizer requests for the approved poster: its last image is not requested
  until the terminal scrolls to it. No test route/flag is added to the app.
- Snapshot hashes of all original serialized records and virtual project files
  match the pre-feature data. The provider regression also covers alias state,
  clear/reset, queue ordering, and failed lazy loading without expansion.

New components and browser/benchmark scripts pass focused ESLint checks.
Repository-wide lint still reports 80 existing errors and 7 warnings; no unrelated
lint repair was attempted (the prior #34 report had 80 errors and 9 warnings).
Browser coverage is Chromium-only, not a claim about Safari, Firefox, or physical
devices. No video playback/fullscreen behavior is claimed by this ticket.

## Production comparison

The pre-feature production build was captured at
`c9922bde43836a370ed426b13d93bb805f1ce1ab` before delivery code changed.
The same benchmark runs against both builds: three fresh contexts per viewport,
DPR 1, 900px height, reduced motion, browser cache disabled, 4× CPU slowdown,
80ms network latency, 200,000 bytes/s download and 93,750 bytes/s upload.
Optional telemetry is disabled identically in both measurements.

The command sequence is `projects`, `pwd`, `portfolio`, `about`, `projects`,
`contact`, preserving and growing history. Input and command measurements are
double-animation-frame event-to-paint proxies, **not INP**. Command timing includes
lazy module delivery. Layout-shift entries measure the whole journey, including
replacement of the welcome output and layout changes, not just image loading;
the benchmark sums entries rather than calculating the Web Vitals CLS session
window score. No numerical performance budget was agreed.

Medians, **before → after**, in milliseconds (input samples pooled per viewport;
repeat-project samples include the alias and the second `projects` output):

| Width | First contentful paint | Page load | Input paint proxy | First projects | Repeated projects |
| --- | --- | --- | --- | --- | --- |
| 390px | 1300 → 924 | 2528 → 1712 | 103 → 40 | 2037 → 1253 | 512 → 278 |
| 900px | 1240 → 968 | 2524 → 1723 | 134 → 42 | 2039 → 1270 | 536 → 294 |
| 1600px | 1452 → 992 | 3091 → 1881 | 123 → 41 | 1956 → 1316 | 633 → 326 |

Observed transfer bytes (CDP encoded transfer totals include response overhead;
image body sizes exclude it):

| Width | Initial page, before → after | Entire command journey, before → after | New optimized poster body |
| --- | --- | --- | --- |
| 390px | 194356 → 211882 | 213952 → 239668 | 4882 (`w=384`) |
| 900px | 194356 → 196275 | 213952 → 248251 | 13464 (`w=828`) |
| 1600px | 225894 → 243420 | 245490 → 276529 | 10204 (`w=640`) |

The existing 26460-byte source poster is not sent at its full original size.
The approved repeated image shares one selected image resource in each run;
distinct per-project future assets would have a different transfer profile.
Initial transfer attribution can vary with asynchronous chunk completion; these
are observed medians, not a fixed bundle-size calculation.

| Width | Sum of non-recent-input shifts, before → after | Sum of all shifts, before → after |
| --- | --- | --- |
| 390px | 0.7246 → 0 | 0.7471 → 0.7911 |
| 900px | 0.7024 → 0 | 0.7218 → 0.7720 |
| 1600px | 0 → 0 | 0.2721 → 3.3274 |

The larger desktop all-shifts sum includes the requested terminal expansion and
restoration during repeated commands; it must not be read as image-induced CLS.
Delayed and broken image checks separately found **zero change in card height**.
The extra image/JS transfer is a cost of the visual feature. These local runs
show responsive input/commands under the selected throttling, not a guaranteed
speedup on every device or connection.

Raw measurements and screenshots were retained locally under
`%LOCALAPPDATA%/Temp/opencode/projects-35-before.json`,
`projects-35-after.json`, and `projects-35-screenshots/`.
