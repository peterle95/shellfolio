# Approved per-project media: issue #43

Completion of [#43](https://github.com/peterle95/shellfolio/issues/43), part of
[#33](https://github.com/peterle95/shellfolio/issues/33). Starting revision:
`6aa5ef95053d26d18276c37dde84e43bdec29bdd` already contains the owner-supplied
media, new project entries, descriptions, posters and screenshot mapping.
This change preserves that order, all copy, link meanings and text alternatives.

## Owner approval and mapping

On 2026-10-23 the owner confirmed in the implementation conversation:

- Approve the existing jobFinder, Pet and FermentStation clips and posters,
  I Pelosetti image, descriptions and text alternatives.
- Keep the disclosed shared Finance Tracker placeholders on remaining entries;
  no entries become text-only in this release.
- All replacement video delivery must be silent. Meaningful descriptions remain
  available without playback; no audio captions accompany the zero-audio copies.

Approval recorded in [the issue comment](https://github.com/peterle95/shellfolio/issues/43#issuecomment-6365168000).
The implementation restated the interpretation of retaining shared placeholders
before proceeding. No new copy, website capture or fabricated media was added.
The owner approved already-present posters; this task did not extract new frames.

| Project (current order) | Approved image | Approved video |
| --- | --- | --- |
| jobFinder | `/videos/jobFinder/jobFinder-poster.webp` | `/videos/jobFinder/jobFinder-silent.mp4` |
| Pet | `/videos/pet/pet-poster.webp` | `/videos/pet/pet-silent.mp4` |
| FermentStation | `/videos/fermentStation/fermentStation-poster.webp` | `/videos/fermentStation/fermentStation-silent.mp4` |
| WEB CONSULTANT & DEVELOPER – I PELOSETTI DI SILVANA ONLUS | `/images/ipelosetti.png` | None (image-only) |
| Printing Press CLIs | Shared poster | Shared silent clip |
| Transcendence | Shared poster | Shared silent clip |
| Webserv | Shared poster | Shared silent clip |
| Shellfolio | Shared poster | Shared silent clip |
| More Projects | Shared poster | Shared silent clip |

Shared poster: `/videos/finance_tracker/finance_tracker-poster.webp`.
Shared clip: `/videos/finance_tracker/finance_tracker-silent.mp4`.
Their content, hashes and alternatives remain those approved in
[`project-content-34.md`](project-content-34.md); the old root-level paths in
that historical handoff are superseded by these relocated paths.
All remaining shared entries keep their shared-placeholder disclosures.
Private repositories remain non-actionable `#` values.

## Delivery inventory and provenance

The three replacement MP4s are H.264, 1920 × 1080, 16:9, with one video stream
and zero audio streams. Existing owner originals are unchanged, including the
previously tracked audio-bearing originals; the UI never references those files.

| Media | Video duration | Silent video bytes | Poster dimensions | Poster bytes |
| --- | ---: | ---: | --- | ---: |
| jobFinder | 38.633333 s | 2,387,976 | 1280 × 720 WebP | 32,592 |
| Pet | 24 s | 2,187,551 | 1280 × 720 WebP | 25,200 |
| FermentStation | 22 s | 1,637,725 | 1280 × 720 WebP | 28,806 |
| Shared Finance Tracker | 22 s | 3,061,715 | 1280 × 720 WebP | 26,460 |

I Pelosetti: 1424 × 728 PNG, 166,387 bytes. Its native aspect ratio is reserved
independently of the 16:9 video posters.

Reproduce silent-copy derivation for each of `jobFinder`, `pet`, `fermentStation`
(replace `<name>` with the directory/file stem):

```sh
ffmpeg -v error -n -i public/videos/<name>/<name>.mp4 -map 0:v:0 -c:v copy -an -map_metadata -1 -movflags +faststart public/videos/<name>/<name>-silent.mp4
```

FFprobe verifies actual delivered streams, not player muting. Decoded-video
SHA-256 comparisons between each original and silent copy match (audio removed,
video unchanged). Source-file hashes below make the untouched inputs traceable.

```text
# Owner originals
568585611412420dc366a241800b0f21d12bc5ebe62c105a5bbe39fc077e570b  public/videos/jobFinder/jobFinder.mp4
ca95c5be18305b93e8428c27bf21ce6f0c73a6cbd1cd0de95d6a293082b76098  public/videos/pet/pet.mp4
30ea6846a7884133d26a933bf628fd5f0e64e8e0e8b347f9a4d6d1fdc7fd6da0  public/videos/fermentStation/fermentStation.mp4
# Silent delivery copies and approved images
60df0425dd05dfbfb4230061b31de1451e21d314702572e35ae10df38f605017  public/videos/jobFinder/jobFinder-silent.mp4
1efda9a4d21b55e2d194f0b0909176d12c2a49731acd9fdf34d4dd7333483843  public/videos/pet/pet-silent.mp4
93f81d5e292193517cf280ddcec3532d2b1c066088a949824ac8424dcc9346b0  public/videos/fermentStation/fermentStation-silent.mp4
efc58f83bde6571978f00a75375b3152aa2f754fe52913c67ddcd63f73622f71  public/videos/jobFinder/jobFinder-poster.webp
6a6b7d067a83f839e8104a1a82a84084c6525f84ba3a4449fa7459fd2cca456a  public/videos/pet/pet-poster.webp
d2b238bb2e38679f6fd8666c8d57263950b5f0b58466565b1354555db9f84b71  public/videos/fermentStation/fermentStation-poster.webp
305717b118fd3d94e621ec911d38f2fdbf5481bbd5ccf9504e8489103df5eed5  public/images/ipelosetti.png
```

## Actual distinct-media request measurements

Raw capture: [`project-media-43-transfers.json`](project-media-43-transfers.json).
Measured 2026-10-23 with local Next.js production, Node 24.18.0, headless Chrome
155.0.8059.86 on Windows. Fresh context per viewport, height 900, DPR 1,
cache disabled, reduced motion, optional telemetry declined, no network/CPU
throttling. Server/optimizer caches were already warm from the browser suite.
One sample per width: these are request/transfer observations, not latency
guarantees, an improvement claim or a comparison to the old shared-URL captures.

The check opens Projects, scrolls through all nine real entries, then explicitly
plays each of the four unique video URLs once, waits for delivery, switches
owners, and leaves Projects to verify cleanup. All image requests precede Play;
zero video requests/bytes occur before the first explicit Play. The five shared
entries reuse one shared image URL; replacements have separate URLs.

| Viewport | Optimizer width | Image requests | Image transfer bytes | Video requests after Play | Video transfer bytes |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 390 | 384 | 5 | 29,252 | 4 | 9,276,319 |
| 900 | 828 | 5 | 81,701 | 4 | 9,276,319 |
| 1600 | 640 | 5 | 60,366 | 4 | 9,276,319 |

CDP encoded transfer bytes include response overhead, not just file bodies.
Each width delivered one successful 206 request per clip: jobFinder 2,388,314,
Pet 2,187,889, FermentStation 1,638,063, Finance Tracker 3,062,053 bytes.
These totals are for deliberately playing **all four** clips, not initial load.

## Verification

- Red: added actual-file checks failed on jobFinder's audio stream before the fix.
- Green: `npm run test:projects -- --report=docs/project-media-43-transfers.json`
  passed against the fresh production build. Requires FFprobe on PATH.
- All actual distinct images and videos load at 390/900/1600px with their correct
  geometry, accessible descriptions, explicit Play and single-owner cleanup.
- Existing responsive/keyboard checks passed at 320, 390, 768, 900, 945, 960,
  1024, 1399, 1400 and 1600px. Native pause/resume/fullscreen, repeated outputs,
  reload, clear/back, section navigation, pending cancellation and errors pass.
- Lazy loading is verified with the production renderer in a tall fixture using
  the actual distinct approved FermentStation poster as its far-offscreen image:
  no request until scrolling near it. This fixture isolates browser lazy-loading
  thresholds; it is not a claim that every below-fold image is initially deferred.
- `npm run build`, `npm run typecheck`, `npm run lint`: passed.
- `node --test scripts/history-store.test.cjs scripts/projects-budget-check.test.cjs scripts/ui-render.test.cjs`:
  all 14 tests passed. Terminal, badge and Grainient regression scripts passed.

Coverage is Chromium on a local production server, not Firefox/Safari, real
mobile hardware or deployed CDN behavior. Prior #37/#39 shared-media measurements
and #42 application profiles remain historical evidence, not replacement-media
performance claims. No new performance budget is asserted.
