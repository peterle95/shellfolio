# Terminal Hydration Reassessment

Date: 2026-09-08

Evidence for [P3: Reassess terminal hydration boundary](https://github.com/peterle95/shellfolio/issues/31), the final child of [Wayfinder: Optimize portfolio runtime performance](https://github.com/peterle95/shellfolio/issues/24). The resolution lives in the issue comment; this report preserves its measurements.

## Build and Protocol

- Source: `be143f0b0b4ba7e1e9287d1d2f825b0cbabd8aef`, clean worktree before measurement.
- Fresh production build ID: `MSJIPPz9fXxL50pn4Rn47`.
- Installed runtime: Node 24.18.0, Next 15.3.8, React and React DOM 19.2.4. The manifest declares Next `^16.3.0`; these measurements describe the installed version, not that declaration. No dependency changes during measurement.
- Chrome 152.0.7977.76, headless, Windows, Intel Iris Xe/ANGLE D3D11.
- Three runs per desktop width, alternating 1440 and 1600, height 900, DPR 1. One browser benchmark at a time.
- Fresh profile per run, extensions disabled, cache disabled, service workers bypassed.
- Fast 4G: 4 Mbps download, 3 Mbps upload, 20 ms latency; 4x CPU slowdown.
- Default telemetry unblocked, fresh storage, privacy panel open, no reduced-motion preference.

## Paint Measurements

Times in milliseconds. Each median uses all three runs for that width, independently per metric.

| Width | Run | LCP | FCP | CLS |
| --- | --- | ---: | ---: | ---: |
| 1440 | 1 | 1008 | 940 | 0.0002254533 |
| 1440 | 2 | 1032 | 1016 | 0 |
| 1440 | 3 | 980 | 844 | 0.0002254533 |
| 1440 | Median | 1008 | 940 | 0.0002254533 |
| 1600 | 1 | 848 | 832 | 0 |
| 1600 | 2 | 1144 | 1144 | 0 |
| 1600 | 3 | 1040 | 856 | 0 |
| 1600 | Median | 1040 | 856 | 0 |

Both medians meet the map's below-2.0-second LCP target and beat its ideal 1.5-1.7-second range on this desktop protocol. In all six runs, Chrome identified `/images/badge-static.webp` as the final LCP element (177,457 square pixels). Five traces first recorded the server-rendered terminal ASCII portrait as an earlier candidate, at about 830-1014 ms.

The prior Badge candidate report recorded 1872/1576 ms medians. Do not treat the difference as a controlled improvement: the source and placeholder changed, and earlier experiments documented machine/session drift.

## Hydration Evidence

`src/components/shellfolio/terminal.tsx` already composes the server-rendered `TerminalShellFrame` and `TerminalWelcome` through client-provider child slots. `TerminalInteractiveViewport` owns history and prompt rendering; `QuickActions` owns client handlers. Another shell/welcome extraction would duplicate the existing boundary.

Load-profile analysis matched sampled minified function columns against the actual built page chunk and separated terminal modules from visual-effects modules. Inclusive time counts a sample once when its stack contains a terminal-module frame, including descendants.

| Terminal-specific sampled work, first 10 seconds | 1440 | 1600 |
| --- | ---: | ---: |
| Inclusive time, runs 1 / 2 / 3 (ms) | 111.9 / 66.0 / 43.7 | 64.3 / 85.5 / 61.2 |
| Median inclusive time (ms) | 66.0 | 64.3 |
| Median self time (ms) | 35.5 | 33.7 |

No terminal-specific samples preceded LCP in these runs; the first appeared around 1.35-1.65 seconds. Identified paths included provider/VFS/history initialization, provider rendering, prompt autofocus, scrolling, and quick actions. Shared React DOM self time in the first three seconds was about 585/558 ms at the median; that includes shared work and cannot all be attributed to terminal hydration.

## Runtime Observations

Independent medians; visible, late, and hidden sampling windows each span about six seconds.

| Metric | 1440 | 1600 |
| --- | ---: | ---: |
| Window load (ms) | 1830.7 | 1789.0 |
| Badge-ready attribute observed (ms) | 15544.1 | 21129.7 |
| First-10-second blocking proxy (ms) | 3966.5 | 3593.0 |
| Visible whole-page script time (ms) | 775.1 | 844.1 |
| Late whole-page script time (ms) | 916.7 | 898.6 |
| Late whole-page task time (ms) | 4455.5 | 4409.8 |
| Late Grainient FPS | 58.83 | 60.09 |
| Hidden whole-page script time (ms) | 14.3 | 32.1 |
| Key-to-two-RAF response proxy (ms) | 150.9 | 130.9 |

Badge chunk requests started after window load in all six runs. Badge made zero draws in visible, late, and hidden samples; Grainient made zero draws while hidden. These observations cover settled rendering, not exact physics-step counts or post-drag sleep.

## Checks and Limits

- Passed: `npm run build`, independent `npm run typecheck`, `node scripts/grainient-check.cjs`, and `node scripts/badge-check.cjs`. Build configuration skips type validation and linting; no lint-pass claim.
- Zero uncaught page exceptions across six browser runs. Each run had two local telemetry failures: `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` returned 404/`ERR_ABORTED`. Clarity execution appeared in traces. Successful Vercel-hosted telemetry delivery remains outside this local measurement.
- Sample attribution is not an exact React component hydration duration. Generic reconciliation, native work, compilation, and unattributed samples prevent complete attribution.
- The long-task observer misses some early tasks visible in traces. Blocking and keyboard proxies are not Lighthouse TBT or field INP.
- The keyboard probe types `help` after settling without submitting it. It does not verify command execution or early-input responsiveness.
- No mobile, populated-history, drag, other-browser, or deployed-origin measurements. Profiling overhead and three runs per width limit generalization.
- Deferred graphics and shared startup still consume time. Meeting LCP does not imply that all responsiveness work is complete; revisit those costs if a future measurement requires it.

## Local Evidence and Reproduction

Raw assets remain outside Git at `C:\Users\molze\AppData\Local\Temp\opencode\terminal-p3-final-20260908`: six result JSONs, six screenshots, six load traces, and eighteen CPU profiles. Derived files: `analysis.json`, `trace-analysis.json`, `trace-summary.txt`, and `evidence-sha256.json`. These are machine-local artifacts, not durable repository attachments.

The existing machine-local harness is `C:\Users\molze\AppData\Local\Temp\opencode\badge-candidate-benchmark.cjs`, SHA-256 `430670e57d4e39a1d968138c1efbb1cdc9f19d5b659bf6aa5f00a3e60cb3e4c8`. It starts and stops its own production server and Chrome, captures load traces, then samples settled/hidden rendering. It requires Chrome at its Windows installation path and an eligible desktop Badge; it is not a mobile harness.

After `npm run build`, verify port 9140 is free, then run from the repository:

```powershell
$temp = 'C:\Users\molze\AppData\Local\Temp\opencode'
if (!(Test-Path -LiteralPath $temp)) { throw 'Missing benchmark directory' }
$env:APP_ROOT = (Get-Location).Path
$env:OUTPUT = "$temp\terminal-p3-$(Get-Date -Format yyyyMMdd-HHmmss)"
$env:PORT = '9140'
$env:WIDTHS = '1440,1600'
$env:RUNS = '3'
$env:RESUME = ''
node "$temp\badge-candidate-benchmark.cjs"
```

Use a new output directory and preserve all runs. The summary above remains available in Git if local raw evidence expires; reproducing the exact harness requires retaining that external script.
