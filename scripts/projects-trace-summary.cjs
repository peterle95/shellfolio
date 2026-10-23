// node scripts/projects-trace-summary.cjs docs/evidence/projects-42 > summary.json
// Wall-time slices on the User Timing marker's renderer thread, not CPU time.
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS analysis. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

function union(intervals) {
    let end = -Infinity, total = 0;
    for (const [start, stop] of intervals.sort((a, b) => a[0] - b[0])) {
        total += Math.max(0, stop - Math.max(start, end));
        end = Math.max(end, stop);
    }
    return total / 1000;
}

const root = process.argv[2];
assert.ok(root, 'supply the evidence directory');
const summary = { note: 'Milliseconds of clipped wall-time union; JS includes nested layout. Never add overlapping columns. No source-function attribution from these totals.', targets: {} };
for (const target of ['before', 'after']) {
    const capture = JSON.parse(fs.readFileSync(path.join(root, `${target}.json`), 'utf8'));
    assert.equal(capture.conditions.tracing, true);
    const rows = [];
    for (const run of capture.runs) {
        const events = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'traces', run.traceFile)))).traceEvents;
        const commands = run.commands.filter(command => command.phase === 'journey');
        assert.equal(commands.length, 7);
        for (const [index, command] of commands.entries()) {
            const name = `command-${index + 5}-${command.command}`;
            const start = events.find(event => event.name === name && event.ph === 'b');
            assert.ok(start, `missing ${name} start`);
            const end = events.find(event => event.name === name && event.ph === 'e' && event.pid === start.pid && event.id2?.local === start.id2.local);
            assert.ok(end && end.ts > start.ts, `missing ${name} end`);
            const slices = events.filter(event => event.pid === start.pid && event.tid === start.tid && event.ph === 'X' && event.dur > 0 && event.ts < end.ts && event.ts + event.dur > start.ts);
            const duration = names => union(slices.filter(event => names.includes(event.name))
                .map(event => [Math.max(start.ts, event.ts), Math.min(end.ts, event.ts + event.dur)]));
            const ms = (end.ts - start.ts) / 1000;
            assert.ok(Math.abs(ms - command.ms) < 5, 'trace marker and page proxy agree');
            const row = { run: run.run, index, command: command.command, ms,
                jsInclusiveMs: duration(['FunctionCall', 'EvaluateScript', 'EventDispatch', 'FireAnimationFrame', 'TimerFire', 'RunMicrotasks']),
                layoutMs: duration(['Layout']), styleMs: duration(['UpdateLayoutTree']),
                paintMs: duration(['PrePaint', 'Paint', 'Layerize']),
                compileMs: duration(['v8.compile']),
                dom: run.commandWork[index].dom,
                layoutObjects: slices.filter(event => event.name === 'Layout').map(event => event.args.beginData.totalObjects),
                layoutDirtyObjects: slices.filter(event => event.name === 'Layout').map(event => event.args.beginData.dirtyObjects),
                layoutStacks: slices.filter(event => event.name === 'Layout' && event.args.beginData.stackTrace)
                    .map(event => event.args.beginData.stackTrace),
                requests: run.beforePlay.filter(request => request.startMs >= command.startMs && request.startMs <= command.startMs + command.ms),
            };
            assert.ok([row.jsInclusiveMs, row.layoutMs, row.styleMs, row.paintMs].every(value => value >= 0 && value <= ms + 0.01));
            rows.push(row);
        }
    }
    summary.targets[target] = rows;
}
console.log(JSON.stringify(summary, null, 2));
