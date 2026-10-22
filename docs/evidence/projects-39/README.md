# Project performance evidence: #39

These files accompany [the #39 report](../../project-performance-39.md).
Keep the original #37 captures separate from the #39 rerun. JSON and screenshots
are versioned files; use GitHub's **Raw** / **Download raw file** action to download
them, or download the repository archive at the report's commit.

## Original #37 capture

- [Baseline JSON](original-37/before.json)
- [Showcase JSON](original-37/after.json)
- [Screenshots](original-37/screenshots/)

Copied without modification from the retained `projects-37-before.json`,
`projects-37-after.json` and `projects-37-screenshots/` captures. The JSON records
the measurement start, target revision, browser, Node version, test conditions,
and each run's input, command, shift and request samples. The screenshots come
from the separate production browser regression suite, not the throttled
benchmark. #37 documents their coverage and host environment.

## #39 rerun

The owner approved ten runs per viewport using the #37 conditions and revisions.
The rerun uses clean detached worktrees and the unchanged #37 benchmark script.
The owner then [approved the budgets](https://github.com/peterle95/shellfolio/issues/39#issuecomment-6339734130)
and recording the current breaches without changing the limits to force a pass.

- [Baseline JSON: 30 completed runs](rerun-39/before.json)
- [Showcase JSON: 30 completed runs](rerun-39/after.json)
- [Derived statistics, per-run distributions and 13 budget violations](rerun-39/summary.json)
- [Host, toolchain and revision metadata](rerun-39/environment.json)
- [New screenshots](rerun-39/screenshots/)
- [Baseline benchmark log](rerun-39/before.log)
- [Showcase benchmark log](rerun-39/after.log)
- [Production browser regression log](rerun-39/browser-check.log)
- [Baseline warm-up](rerun-39/warm-before.json)
- [Showcase warm-up](rerun-39/warm-after.json)

Warm-ups use one 390px run per target and do not count toward the ten samples
per viewport. Next.js rewrote only the temporary worktrees' `tsconfig.json`
during each build (automatic JSX and generated-type settings). Both fresh
production builds and separate TypeScript checks passed. The installs reported
115 existing audit advisories (3 low, 74 moderate, 34 high, 4 critical); this work
does not change dependencies or claim to resolve them.

## Excluded first attempt

[The first baseline batch log](rerun-39/failed-before-1.log) ends after 28 runs
with `ERR_CONNECTION_REFUSED`. The detached baseline and idle showcase server
processes no longer existed; their stdout contained startup messages and neither
stderr log contained a crash report. The exact exit cause remains unknown.
The benchmark writes its JSON only after completing the full batch, so this
attempt produced no completed measurement JSON. Its timing lines do **not** count
toward the rerun or any budget decision.

The rerun uses tool-managed long-lived server sessions and repeats both warm-ups
before restarting the full baseline batch. The `first-attempt-*` files remain
separate from the accepted captures.

## Integrity

[SHA256SUMS](SHA256SUMS) covers the JSON, PNG and log files with relative paths.
From this directory, use `sha256sum --check SHA256SUMS` where available, or
PowerShell's `Get-FileHash -Algorithm SHA256` for the listed files. Local
`.gitattributes` disables text conversion for these captures so Git preserves
their bytes. The manifest checks integrity, not capture authenticity or proof
of the benchmark host's physical state.
