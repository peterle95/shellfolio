# Desktop profiling evidence: #42

See [the investigation report](../../project-profile-42.md) for findings,
conditions, reproduction and limitations.

- `before.json`, `after.json`: complete ten-run desktop captures; command/input
  timings, CDP counter deltas, attached DOM counts and request timings.
- `traces/*.trace.json.gz`: one recorded Chrome trace per run, including initial
  navigation, seed commands, typing and the seven-command journey. Decompress
  before importing into Chrome DevTools Performance. These contain local target
  URLs and sampled shipped JavaScript frames, not credentials or remote captures.
- `summary.json`: derived, per-command renderer-thread trace windows. Regenerate:

  ```sh
  node scripts/projects-trace-summary.cjs docs/evidence/projects-42 > docs/evidence/projects-42/summary.json
  ```

  Run from the repository root. Every trace marker is checked against the page
  timing proxy. Durations are clipped unions of matching complete events on the
  marker's renderer thread. Nested events of the same category are counted once.
  **JavaScript totals include nested layout/paint and must not be added to those
  columns.** Other threads, raster/GPU execution and unlabelled work are not
  apportioned. Empty layout-stack arrays mean the trace did not supply that
  stack; they do not establish that layout was asynchronous or unforced.
- `SHA256SUMS`: byte-integrity manifest, relative to this directory. Download
  evidence using GitHub Raw / Download raw file or a repository archive.
- `environment.json`: host and measured build identities; `shipped-scroll.json`:
  hashed shipped-chunk excerpts for the synchronous scroll-layout stacks.
- `warm-before.json`, `warm-after.json`: excluded single-run desktop warm-ups.
  Their traces were temporary and are not included in the measured trace set.

The #37 and #39 untraced measurements remain separate. Do not use these traced
samples as a budget gate or pool them with those cohorts.
