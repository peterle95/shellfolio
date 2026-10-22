# Click-to-play project videos: issue #36

## Recommendation and scope

Extend the existing project preview with a native, source-less `<video>` and
an explicit, centered icon-only Play button. Assign the approved silent MP4 source
and call `play()` only inside that button's event handler. Keep one playback owner in the existing
terminal provider; changing owners or opening a section releases the old player.
No new dependency, media platform, asset transformation, or original-video edit.

Repository: `C:\Users\molze\GitHub\shellfolio`, branch `project`.
Requested outcome: [#36](https://github.com/peterle95/shellfolio/issues/36),
following published #35 (`23d5682`). Assumptions: #34's approved shared-placeholder
exception still applies to all seven entries; the supplied silent clip is the
only release video. Publication and verification are tracked in #36.

## Repository map and evidence

Paths below are relative to the repository above. Line references describe the
pre-#36 source, not the stale graph snapshot.

| Constraint / subsystem | Direct evidence |
| --- | --- |
| Approved assets, exact alternatives, no music | [`docs/project-content-34.md`](../docs/project-content-34.md), lines 8–26, 60–102 |
| Shared metadata; unchanged serialization | [`src/lib/portfolio-data.ts`](../src/lib/portfolio-data.ts), lines 11–38, `projectsAsRecords()` |
| Reserved responsive preview and links | [`src/components/shellfolio/terminal/ProjectsOutput.tsx`](../src/components/shellfolio/terminal/ProjectsOutput.tsx), lines 8–64; adjacent CSS |
| Shared navigation/reset ownership | [`src/lib/terminal/terminal-state.tsx`](../src/lib/terminal/terminal-state.tsx), lines 45–111 |
| Outputs remain mounted in history | [`src/components/shellfolio/terminal/TerminalInteractiveViewport.tsx`](../src/components/shellfolio/terminal/TerminalInteractiveViewport.tsx), lines 13–34 |
| Bounded history can unmount old outputs | [`src/lib/terminal/history-store.ts`](../src/lib/terminal/history-store.ts), lines 45–59 |
| Approved public browser seam and real image delivery | [`docs/project-showcase-35.md`](../docs/project-showcase-35.md), lines 67–103; [`scripts/projects-browser-check.cjs`](../scripts/projects-browser-check.cjs) |
| Independent typecheck required | [`next.config.ts`](../next.config.ts), lines 5–7; [`package.json`](../package.json), lines 9–15 |

The existing graph query used its exact vocabulary: `projects terminal history
provider output image`. It located `Projects()`, `TerminalProvider()`, and
`HistoryStore`, but its snapshot predates #35 and its 1,500-token result was
truncated. Current source, not inferred graph relationships, determines this plan.
No glossary or area ADR exists. Unrelated local instructions, configuration,
original video, and untracked local image are outside this slice.

## Vault guidance

Read-only search of `C:\Users\molze\GitHub\Obsidian\AI` found no directly
relevant native-video implementation note. Unrelated embedded article videos
were not treated as guidance.

- [`react-useeffect.md`](../../Obsidian/AI/wiki/topics/react-useeffect.md),
  **Key Points**, lines 25–29: use event handlers for event-driven work, primitive
  effect dependencies, and real cleanup.
- [`the-problem-with-useeffect.md`](../../Obsidian/AI/wiki/sources/tech/the-problem-with-useeffect.md),
  **Key Points**, lines 32–38: effect dependency identity is a lifecycle contract;
  avoid redundant mirrored state and missing cleanup.

Absolute vault base for both citations:
`C:\Users\molze\GitHub\Obsidian\AI\wiki`. These are supporting React
guidelines, not evidence for browser media behavior. There is no conflict with
repository conventions; actual playback/resource claims require browser checks.

## Candidate comparison

1. **Provider-owned active preview ID, native player (chosen).** Small changes
   to metadata, provider, preview/CSS, and existing checks. The provider already
   observes section changes and resets; a preview's cleanup pauses, removes its
   source, and calls `load()`. Explicit click attaches the source synchronously,
   preserving user activation. Risk: lifecycle/focus races, covered in browser.
   Reversible without data migration. Fits both repository and vault guidance.
2. **Local state plus document-wide stop events.** Similar initial size, but
   requires listeners across retained outputs and a new global protocol for
   navigation/reset. Harder to scope to one terminal and clean up. Rejected:
   duplicates ownership already available in the provider; the vault warns about
   missing effect cleanup and redundant state.

## File-level plan and tests

1. Add a rendered-page check for zero pre-Play requests/sources, keyboard Play,
   actual approved playback, native controls/fullscreen, and stable geometry.
   Implement the smallest preview extension to pass it.
2. Add cross-card/history/navigation/reset cleanup coverage; lift the active
   preview ID to the provider. Keep only the selected video sourced; unload it
   on supersession, section change, reset, error, and unmount.
3. Exercise real playback on phone/desktop, delayed/failed video requests,
   populated history, and replay. Preserve the existing image-only/text-only
   fixtures, snapshot hashes, responsive/lazy-image checks, and terminal checks.
4. Run `npm run build`, `npm run typecheck`, `npm run test:projects` against a
   production server, all three existing regression scripts, and focused ESLint.
   Record outcomes and browser limitations here.

Rollback: remove optional video metadata, player UI/styles, provider playback
ownership, and the new checks together; the #35 image path remains unchanged.
No schema or asset migration is required.

## Risks and open questions

- Safari, Firefox, physical phones, and platform-native fullscreen require their
  own runs; Chromium desktop emulation alone cannot verify them.
- Silent shared footage is an explicitly disclosed owner-approved exception,
  not evidence that these are seven project-specific demos.
- Future speech/audio assets require a fresh accessibility/content review.
- Preserve unrelated working-tree changes and the audio-bearing owner file.

## Reproduce

Use Node 20+ and Chrome/Edge detected on Windows, `BROWSER_PATH`, or an installed
Playwright Chromium (`npx playwright install chromium`).

```sh
npm ci
npm run build
npm run start -- --port 9360
```

In another terminal:

```sh
npm run typecheck
node scripts/terminal-check.cjs
node scripts/badge-check.cjs
node scripts/grainient-check.cjs
npm run test:projects -- --url=http://localhost:9360 --screenshots=<directory>
node node_modules/eslint/bin/eslint.js src/components/shellfolio/terminal/ProjectsOutput.tsx scripts/projects-browser-check.cjs
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -show_entries format=duration,size -of json public/videos/finance_tracker-silent.mp4
```

The optional fixture's existing source loader also resolves directory `index.ts`
modules now that the production preview imports the terminal context. Fixture
entries explicitly omit video metadata to keep image-only/text-only coverage;
there is no new application test route, video substitute, or runtime flag.

## Verification on 2026-10-22

Passed production build, independent typecheck, all three existing regression
scripts, and the complete extended production-browser check in Chrome
155.0.8059.86 on Windows. No dependency or release asset changed.

- **Requested UI:** a centered 64px high-contrast circular Play icon, with no
  visible “Play video” text. The button retains its contextual shared-placeholder
  accessible name, keyboard operation, and visible focus. Browser assertions
  verify its center/touch target; 390px and 1600px screenshots were inspected.
- **Privacy and actual media:** populated/repeated project history attaches no
  video source or video preload and makes zero MP4/WebM requests before Play.
  Enter/Space activation fetches the real approved silent MP4; playback time
  advances, with 22-second duration and decoded 1920×1080 dimensions. No original
  audio-bearing video is requested. `ffprobe` reconfirms one H.264 video stream
  and no audio stream; original, silent-video, and poster hashes remain unchanged.
- **Native playback:** controls and inline playback are enabled, the autoplay
  attribute is absent/false, focus transfers to the native player, keyboard
  pause/resume works, and the standard fullscreen API is exercised where supported.
- **Resource ownership:** playing a second card unloads the first; repeating
  `projects`/`portfolio`, opening About, clear, and Back release playback even
  though prior outputs are retained or unmounted. Checks observe removed sources,
  paused state, `readyState=0`, and `networkState=0`, not just hidden controls.
  An earlier retained output can be explicitly played again. Ordinary shell
  commands preserve the single selected player, without creating additional ones.
- **Pending/failed media:** interception deliberately holds or aborts the approved
  video request at both 390px and 1600px. Typing and `pwd` still complete; project
  copy/links remain usable. Supersession aborts the outstanding browser request
  with `net::ERR_ABORTED`. These are network-failure tests, not a substituted video.
- **Geometry and regressions:** poster-to-player, pending, and failed video states
  produce zero card-height change at the tested widths. Existing 320–1600px
  responsive, navigation, retained-history, keyboard-link, scroll, responsive-image,
  delayed/broken-image, and real lazy-loading checks pass. The same renderer's
  image-only/text-only fixture passes, as do original record/virtual-file hashes.
- **Lint:** preview and browser-check files pass focused ESLint. The provider still
  reports two existing rules (`react-hooks/set-state-in-effect` and
  `react-hooks/immutability`); linting its `23d5682` contents through stdin confirms
  the same two pre-existing findings. This is not a repository-wide lint-clean claim.

The checks first failed for the missing Play action, then for two retained cards
playing simultaneously; the completed implementation passes both. Screenshot
artifacts remain local at
`C:\Users\molze\AppData\Local\Temp\opencode\projects-36-screenshots`.
Safari, Firefox, physical devices, platform-native mobile fullscreen, and PiP
were not tested or claimed. No new performance guarantee is inferred from these
functional/resource checks. Publication status and commit links are recorded in #36.
