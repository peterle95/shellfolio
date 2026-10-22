# Production project showcase verification: issue #37

Verification for [#37](https://github.com/peterle95/shellfolio/issues/37), part of
[#33](https://github.com/peterle95/shellfolio/issues/33). The completed feature is
`dc0f1e60c404e256c74a8c7b6729b0e3f72290c1` (#35 cards and #36 playback).
The pre-feature baseline is `c9922bde43836a370ed426b13d93bb805f1ce1ab`:
approved content exists, but projects still use the original structured output.

## Verification outcome

Passed both production builds, independent typecheck, the complete production
browser suite, all three terminal/badge/Grainient regression scripts, and 18
fresh before/after benchmark runs. Both changed scripts pass focused ESLint.
Repository-wide `npm run lint` still reports **80 existing errors and 7 warnings**
outside this change; no unrelated lint repair ships here. Release video/poster
and original-owner-video SHA-256 hashes still match the #34 handoff.
Independent Standards and Spec reviews each reported zero findings.

The measured feature keeps video delivery opt-in, preserves media geometry and
finishes input/commands while media is pending. It adds bytes and command-render
time compared with JSON output. Chromium-only coverage and an existing reload
recall bug remain limitations, detailed below. No owner decision blocks the
approved shared-placeholder release; project-specific replacements remain deferred.

## Scope and environment

- Fresh production builds and measurements on **2026-10-22**, not the historical
  numbers in `project-showcase-35.md`. Windows 11 Home 10.0.26200 x64,
  Intel Core i7-1355U (10 cores / 12 logical processors), Node 24.18.0,
  Next 16.3.0 / Turbopack, Playwright 1.64.1, headless Chrome 155.0.8059.86.
- Same browser and benchmark script for both targets; runs are sequential,
  not simultaneous. Three fresh contexts at each of 390, 900 and 1600px,
  height 900px, DPR 1, reduced motion, browser cache disabled, CPU 4× slowdown,
  network 80ms latency / 200,000 bytes/s down / 93,750 bytes/s up.
  Server/optimizer caches were warmed with a smoke run. Optional telemetry is
  declined identically. These are local production servers, not CDN measurements.
- Five `pwd` commands populate history before the common measured journey:
  `projects`, `pwd`, `portfolio`, `about`, `projects`, `contact`, `projects`.
  This retains four project outputs, includes the alias, and restores another
  section twice. Each common command settles network activity before the next.
- The candidate then explicitly plays the supplied video and types/executes
  `pwd` and `ls projects` **while the real throttled MP4 request is in flight**.
  This extra opt-in phase is reported separately, not compared against a
  nonexistent baseline player. A further `portfolio` releases the source and
  must not initiate another video request.

Input timings start at the browser input event and end after two animation
frames. Command timings start at Enter, observe a new rendered history entry,
then wait two animation frames. They are diagnostic event-to-render proxies,
**not INP**, hardware key-to-screen latency, or latency guarantees. The benchmark
now observes rendered entry insertion instead of the earlier storage write.
CDP request timestamps are relative to that navigation's monotonic start;
resource timings also record poster request/response/duration and body bytes.
Layout-shift sums include user-triggered expansion, restoration and scrolling;
they are **not the session-window Web Vitals CLS score** or image-only shifts.

## Fresh before/after results

Baseline capture started at 08:47:00 UTC; candidate capture started at
08:50:20 UTC. The common journey's medians below are **before → after**, in ms.
Input columns pool 144 events per viewport per target; p95 uses nearest rank.
First Projects has three samples; repeated Projects pools nine samples
(`portfolio` and the later `projects` commands).

| Width | FCP | Page load | Input p50 / p95 | First Projects | Repeated Projects |
| --- | --- | --- | --- | --- | --- |
| 390 | 852 → 1288 | 1954 → 2274 | 34 / 110 → 29 / 70 | 498 → 865 | 228 → 260 |
| 900 | 900 → 920 | 1676 → 2021 | 30 / 51 → 39 / 125 | 596 → 829 | 125 → 430 |
| 1600 | 980 → 1152 | 1907 → 2138 | 27 / 47 → 43 / 105 | 575 → 1387 | 134 → 564 |

DOMContentLoaded medians: 465 → 506ms, 485 → 425ms and 477 → 468ms respectively.
The feature adds transfer and render work; these runs **do not show a general
speedup**. The desktop restoration journey also contains a 2382ms Contact
outlier. Input and commands complete during media loading, but the higher render
times and tails remain release costs. No numerical budget was agreed. The checks
found no showcase regression requiring an application fix; this ticket changes
measurement/regression coverage and documentation, not application code or
approved media.

### Transfers and request timing

CDP encoded transfer totals include response overhead. The common journey ends
before Play, and **all 18 before/after runs request zero video bytes before Play**.

| Width | Initial page bytes, before → after | Common journey bytes, before → after | Optimized poster body | Poster request after first Projects Enter / duration |
| --- | --- | --- | --- | --- |
| 390 | 194373 → 195488 | 213969 → 241740 | 4882, `w=384` | 851 / 119ms |
| 900 | 211012 → 195488 | 213969 → 250323 | 13464, `w=828` | 812 / 162ms |
| 1600 | 226943 → 227026 | 245507 → 278601 | 10204, `w=640` | 1363 / 163ms |

Initial attribution varies with asynchronous chunk completion; this is not a
fixed bundle-size comparison. The 900px stacked preview is wider than a desktop
column, so its selected image is larger. The optimizer does not send the full
26,460-byte source poster. All entries share one URL, which the browser reuses
within a run; unique future assets would have a different request profile.

The candidate's extra Play phase issues **one successful 206 MP4 request per run**
(nine total): 3,061,715 body bytes and 3,062,053 CDP transfer bytes each. It requests
`/videos/finance_tracker-silent.mp4`, never the audio-bearing original.
`ffprobe` confirms H.264, 1920×1080, 22 seconds, and zero audio streams.

| Width | Request start after Play | Request TTFB | First `playing` event after Play | Full request duration | Loading input p50 / p95 | Loading command p50 / max |
| --- | --- | --- | --- | --- | --- | --- |
| 390 | 286ms | 243ms | 1085ms | 15.58s | 81 / 195ms | 185 / 374ms |
| 900 | 168ms | 229ms | 1285ms | 15.61s | 87 / 166ms | 175 / 367ms |
| 1600 | 217ms | 241ms | 1589ms | 15.66s | 98 / 137ms | 152 / 401ms |

Each viewport contributes 42 input events and six commands whose start timestamps
overlap a real pending MP4 transfer. Startup uses the browser's `playing` event,
not a hardware first-frame measurement. After the cleanup `portfolio`, no
downloadable source remains and no new video request starts.

### Layout shifts

| Width | Non-recent-input shift sum, before → after | All-shift sum, before → after |
| --- | --- | --- |
| 390 | 0 → 0 | 0.3311 → 0.3951 |
| 900 | 0 → 0 | 0.3051 → 0.3785 |
| 1600 | 0 → 0 | 0.0997 → 4.2349 |

The desktop sum includes requested terminal expansion/restoration across retained
outputs. Do not interpret it as asset-induced CLS. Separate delayed/broken-media
and actual-playback checks observe **0px card-height change**.

### Per-run loading evidence

Tuples are **FCP / page load / first Projects**, rounded ms, in execution order.
These expose variation hidden by the medians above.

| Width / run | Before | After |
| --- | --- | --- |
| 390 / 1 | 1020 / 2288 / 498 | 1340 / 2274 / 865 |
| 390 / 2 | 840 / 1619 / 1297 | 1288 / 2008 / 799 |
| 390 / 3 | 852 / 1954 / 456 | 924 / 2491 / 910 |
| 900 / 1 | 888 / 1721 / 596 | 1296 / 2495 / 919 |
| 900 / 2 | 900 / 1659 / 473 | 880 / 1658 / 829 |
| 900 / 3 | 996 / 1676 / 630 | 920 / 2021 / 745 |
| 1600 / 1 | 964 / 1798 / 575 | 1076 / 2068 / 1387 |
| 1600 / 2 | 980 / 2024 / 655 | 1152 / 2283 / 1654 |
| 1600 / 3 | 1056 / 1907 / 545 | 1196 / 2138 / 1253 |

The commands below regenerate full JSON with individual input/command samples,
layout-shift entries, and timestamped request/transfer records. Original captures
remain local under `%LOCALAPPDATA%/Temp/opencode/projects-37-before.json`,
`projects-37-after.json` and `projects-37-screenshots/`; they are not hosted
artifacts. The tables above publish the run-level loading evidence and summaries.

## Reproduce

Use the same installed Chrome/Edge (Windows paths are auto-detected),
`BROWSER_PATH`, or `npx playwright install chromium`. Use Node 20+.
Keep the verification checkout as the main directory and create a detached
baseline worktree; do not replace an owner's working tree.

```sh
git worktree add --detach <baseline-dir> c9922bde43836a370ed426b13d93bb805f1ce1ab
```

In each checkout, separately:

```sh
npm ci
npm run build
```

Start the baseline server from its checkout and the candidate from its checkout:

```sh
# baseline terminal
npm run start -- --port 9371
# candidate terminal
npm run start -- --port 9370
```

From the verification checkout, warm each target with `--runs=1 --widths=390`,
then run these commands **one at a time**, with no other builds/tests running:

```sh
npm run benchmark:projects -- --url=http://localhost:9371 --baseline --revision=c9922bde43836a370ed426b13d93bb805f1ce1ab --report=<before.json>
npm run benchmark:projects -- --url=http://localhost:9370 --revision=dc0f1e60c404e256c74a8c7b6729b0e3f72290c1 --report=<after.json>
```

`--baseline` skips only the extra opt-in video phase. The common navigation,
history, typing, cache and throttling conditions are unchanged. `--revision` is
an explicit target label; it does not switch the running server's checkout.
The baseline has no Playwright dependency: run both measurements from the
verification checkout. An initial junction-based baseline build was rejected by
Turbopack; the successful baseline used its own clean `npm ci` installation.
The runtime lockfile entries are identical between revisions; #35 added only
the Playwright development tools.

Regression commands, after measurements:

```sh
npm run typecheck
node scripts/terminal-check.cjs
node scripts/badge-check.cjs
node scripts/grainient-check.cjs
npm run test:projects -- --url=http://localhost:9370 --screenshots=<directory>
node node_modules/eslint/bin/eslint.js scripts/projects-benchmark.cjs scripts/projects-browser-check.cjs
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -show_entries format=duration,size -of json public/videos/finance_tracker-silent.mp4
```

## Browser coverage and limitations

- Projects button, `projects` and `portfolio`; retained/repeated output;
  About, Education, Work, CV, Contact, Credentials, Help and aliases restore
  normal width and the badge without removing the older showcase.
- 320, 390, 768, 900, 945, 960, 1024, 1399, 1400 and 1600px: exact approved
  short/full copy, stacks, ordering, link destinations and availability, visible
  phone media, readable two-column text, and no horizontal page/terminal overflow.
  This brackets the content-based row transition and the former 1400px badge/
  spacer layout. Screenshots at 390, 900 and 1600px were visually inspected.
- Internal first-card positioning, repeated-output positioning, keyboard
  scrolling, native link focus/activation and no preview-click jump to the prompt.
- Zero downloadable video sources/preloads/MP4 requests before Play; actual
  22-second 1920×1080 silent playback after keyboard activation; native controls,
  pause/resume, focus transfer and standard fullscreen API where supported.
  Cross-card/history/navigation/clear/Back cleanup leaves no second sourced
  player and cancels an outstanding request, not merely hidden controls.
- Deliberately delayed/failed poster and video delivery leaves input, commands,
  text and links usable. Reserved card height changes by **0px** in these checks,
  poster-to-player checks, and the actual throttled-playback benchmark.
- The actual optimizer selects smaller phone posters. A longer image-only fixture
  uses the production renderer/CSS and real optimizer responses with distinct
  cache keys: a far-offscreen image is unrequested until internal scrolling.
  Text-only/image-only states are fixture coverage, not additional owner assets.
- All original serialized-project and virtual-file hashes remain identical to
  the pre-feature records. The browser also lists and reads every `/projects/`
  file, reads a relative path after `cd`, recalls commands with arrow keys and
  checks reload persistence and recall after a fresh command. Existing persistence
  intentionally retains commands, not React output or active playback.

### Existing reload-history limitation

The first version of the added reload check failed: immediately after reload,
Up-arrow returned an empty input despite the restored command entries. A minimal
browser reproduction (`pwd`, reload, Up) fails on **both** the fresh pre-feature
baseline and candidate. Waiting for hydration and explicitly focusing the input
does not change it. Executing a new command initializes recall, after which Up
can reach the persisted command on both builds.

`HistoryStore.load()` restores entries but leaves `currentIndex` at `-1`;
`push()`/`resetNavigation()` initialize it on a subsequent command. This is an
existing terminal limitation, not a showcase regression. No unrelated history
repair ships here. The permanent browser check verifies stored entries plus
recall after a fresh command; it does not silently claim immediate post-reload
recall works. A separate terminal follow-up can initialize the restored cursor.

Only the approved shared Finance Tracker poster and silent clip were supplied
for this release; all seven entries honestly disclose that shared placeholder.
No standalone project-specific image, different video format, speech/captions,
or unique-media-per-project delivery profile is claimed. The local untracked
image and audio-bearing original are not part of the approved release package.

Coverage is Chromium desktop with viewport resizing, not physical phones,
Safari, Firefox, OS-native mobile fullscreen or PiP. Reduced-motion measurements
do not characterize continuous GPU animation. Local runs, three samples per
viewport, warm server caches, browser scheduling and asynchronous chunk timing
limit generalization; host load and thermal state were not controlled. No
numerical latency/byte budget was agreed. Replacing
the shared placeholder and testing other browser/device families remain owner
follow-ups, not silently inferred approvals or speed guarantees.
