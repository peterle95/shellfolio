// Summarize saved production captures; no approved limits means no budget verdict.
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS CLI, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { parseArgs } = require('node:util');

const videoURL = url => /\.(mp4|webm)(?:[?#]|$)/i.test(url);
const journeyCommands = ['projects', 'pwd', 'portfolio', 'about', 'projects', 'contact', 'projects'];
const conditions = capture => Object.fromEntries(Object.entries(capture.conditions).filter(([key]) => key !== 'note'));
const metricSources = {
    inputP95Ms: ['inputMs', 'p95'], firstProjectsMedianMs: ['firstProjectsMs', 'p50'],
    firstProjectsP95Ms: ['firstProjectsMs', 'p95'], repeatedProjectsMedianMs: ['repeatedProjectsMs', 'p50'],
    repeatedProjectsP95Ms: ['repeatedProjectsMs', 'p95'], restorationP95Ms: ['restorationMs', 'p95'],
    loadingInputP95Ms: ['loadingInputMs', 'p95'], loadingCommandP95Ms: ['loadingCommandMs', 'p95'],
    playingP95Ms: ['playingMs', 'p95'], journeyTransferMaxBytes: ['journeyTransferBytes', 'max'],
    posterBodyMaxBytes: ['posterBodyBytes', 'max'], videoTransferMaxBytes: ['videoTransferBytes', 'max'],
};
function statistics(samples) {
    if (!samples.length) return null;
    assert.ok(samples.every(value => Number.isFinite(value) && value >= 0), 'Invalid timing/byte samples');
    const sorted = [...samples].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return {
        samples: sorted.length, min: sorted[0],
        p50: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
        p95: sorted[Math.ceil(sorted.length * 0.95) - 1], max: sorted.at(-1),
    };
}

function samples(run, baseline) {
    const journey = run.commands.filter(sample => sample.phase === 'journey');
    const posters = run.images.filter(image => {
        const url = new URL(image.url);
        return url.pathname === '/_next/image' && url.searchParams.get('url') === '/videos/finance_tracker-poster.webp';
    });
    assert.deepEqual(journey.map(sample => sample.command), journeyCommands, 'Incomplete command journey');
    assert.equal(run.inputs.filter(sample => sample.phase === 'journey').length, 48, 'Incomplete journey input samples');
    assert.ok([...run.inputs, ...run.commands].every(sample => Number.isFinite(sample.ms) && sample.ms >= 0), 'Invalid input/command timing');
    assert.ok(run.beforePlay.every(request => !videoURL(request.url)), 'Video request before Play');
    assert.ok(run.beforePlay.every(request => request.endMs != null && !request.error && Number.isFinite(request.transferBytes) && request.transferBytes >= 0),
        'Incomplete journey transfer evidence');
    if (!baseline) {
        assert.ok(run.playback, 'Missing real media-loading phase');
        const loading = sample => sample.phase === 'video-loading' && sample.duringVideoRequest === true;
        assert.deepEqual(run.playback.commands.filter(loading).map(sample => sample.command), ['pwd', 'ls projects'], 'Missing commands during real video delivery');
        assert.equal(run.playback.inputs.filter(loading).length, 14, 'Missing input during real video delivery');
        assert.equal(run.playback.plays.length, 1, 'Missing explicit Play evidence');
        assert.ok(run.playback.playing.some(time => time >= run.playback.plays[0]), 'Missing playing event');
        assert.ok(posters.length > 0, 'Missing approved optimized poster evidence; new assets need a new budget scope');
        const media = run.transfers.filter(request => videoURL(request.url));
        assert.ok(media.length && media.every(request => !request.error && request.endMs != null && request.transferBytes > 0), 'Incomplete video transfer evidence');
        assert.ok(media.every(request => new URL(request.url).pathname === '/videos/finance_tracker-silent.mp4'), 'Unapproved video scope; replacement assets need a new owner decision');
    }
    const projects = journey.filter(sample => ['projects', 'portfolio'].includes(sample.command));
    const loading = sample => sample.phase === 'video-loading' && sample.duringVideoRequest;
    const transfer = requests => requests.reduce((sum, request) => sum + (request.transferBytes ?? request.receivedEncodedBytes ?? 0), 0);
    const play = run.playback?.plays[0];
    const playing = run.playback?.playing.find(time => time >= play);
    return {
        inputMs: run.inputs.filter(sample => sample.phase === 'journey').map(sample => sample.ms),
        firstProjectsMs: [projects[0].ms], repeatedProjectsMs: projects.slice(1).map(sample => sample.ms),
        restorationMs: journey.filter(sample => ['about', 'contact'].includes(sample.command)).map(sample => sample.ms),
        loadingInputMs: run.playback?.inputs.filter(loading).map(sample => sample.ms) ?? [],
        loadingCommandMs: run.playback?.commands.filter(loading).map(sample => sample.ms) ?? [],
        playingMs: playing == null ? [] : [playing - play],
        fcpMs: [run.firstContentfulPaintMs], loadMs: [run.navigation.loadMs],
        initialTransferBytes: [transfer(run.initialTransfers)], journeyTransferBytes: [transfer(run.beforePlay)],
        posterBodyBytes: posters.map(image => image.bodyBytes),
        videoTransferBytes: baseline ? [] : [transfer(run.transfers.filter(request => videoURL(request.url)))],
    };
}

function summarize(capture) {
    assert.match(capture.revision, /^[a-f0-9]{40}$/i, 'Missing full target revision');
    const { widths, runsPerViewport } = capture.conditions;
    assert.ok(Number.isInteger(runsPerViewport) && runsPerViewport > 0, 'Invalid runsPerViewport');
    assert.ok(Array.isArray(widths) && widths.length && new Set(widths).size === widths.length, 'Invalid viewport widths');
    assert.ok(widths.every(width => Number.isInteger(width) && width >= 320), 'Invalid viewport widths');
    assert.equal(capture.runs.length, widths.length * runsPerViewport, 'Incomplete or extra runs');
    for (const width of widths) {
        assert.deepEqual(capture.runs.filter(run => run.width === width).map(run => run.run).sort((a, b) => a - b),
            Array.from({ length: runsPerViewport }, (_, index) => index + 1), `Missing or duplicate runs at ${width}px`);
    }
    return { revision: capture.revision, measuredAt: capture.measuredAt, widths: capture.conditions.widths.map(width => {
        const runs = capture.runs.filter(run => run.width === width);
        const perRun = runs.map(run => ({ run: run.run, samples: samples(run, capture.baseline) }));
        const keys = Object.keys(perRun[0].samples);
        const pooled = Object.fromEntries(keys.map(key => [key, statistics(perRun.flatMap(run => run.samples[key]))]));
        return { width, runs: runs.length,
            statistics: pooled,
            metrics: Object.fromEntries(Object.entries(metricSources).map(([name, [series, statistic]]) => [name, pooled[series]?.[statistic] ?? null])),
            perRun: perRun.map(run => ({ run: run.run,
                statistics: Object.fromEntries(keys.map(key => [key, statistics(run.samples[key])])),
            })),
        };
    }) };
}

try {
    const { values } = parseArgs({ options: {
        before: { type: 'string' }, after: { type: 'string' }, report: { type: 'string' }, budgets: { type: 'string' },
    } });
    assert.ok(values.before && values.after, 'Supply --before=<baseline.json> and --after=<showcase.json>');
    const before = JSON.parse(fs.readFileSync(values.before, 'utf8'));
    const after = JSON.parse(fs.readFileSync(values.after, 'utf8'));
    for (const capture of [before, after]) {
        for (const key of ['browser', 'node', 'platform']) assert.ok(typeof capture[key] === 'string' && capture[key].trim(), `Missing ${key} metadata`);
        assert.ok(Number.isFinite(Date.parse(capture.measuredAt)), 'Missing measurement timestamp');
        for (const key of ['cpuSlowdown', 'downloadBytesPerSecond', 'uploadBytesPerSecond', 'deviceScaleFactor', 'viewportHeight']) {
            assert.ok(Number.isFinite(capture.conditions[key]) && capture.conditions[key] > 0, `Invalid ${key} conditions`);
        }
        assert.ok(Number.isFinite(capture.conditions.latencyMs) && capture.conditions.latencyMs >= 0, 'Invalid latencyMs conditions');
        for (const key of ['cache', 'reducedMotion']) assert.ok(typeof capture.conditions[key] === 'string' && capture.conditions[key].trim(), `Missing ${key} conditions`);
        assert.deepEqual(capture.conditions.journey, journeyCommands, 'Unsupported command journey conditions');
        assert.deepEqual(capture.conditions.historySeed, Array(5).fill('pwd'), 'Unsupported history seed conditions');
    }
    assert.equal(before.baseline, true, '--before must be a pre-showcase baseline capture');
    assert.equal(after.baseline, false, '--after must include the showcase playback phase');
    for (const key of ['browser', 'node', 'platform']) assert.equal(before[key], after[key], `Mismatched ${key}`);
    assert.deepEqual(conditions(before), conditions(after), 'Mismatched test conditions');
    const result = { budgetStatus: 'not-evaluated',
        note: 'Diagnostic input/command event-to-render proxies, not INP. Shift sums are not Web Vitals CLS. No limits evaluated.',
        browser: after.browser, node: after.node, platform: after.platform, conditions: after.conditions,
        before: summarize(before), after: summarize(after),
    };
    if (values.budgets) {
        const budgets = JSON.parse(fs.readFileSync(values.budgets, 'utf8'));
        assert.ok(typeof budgets.approvedBy === 'string' && budgets.approvedBy.trim() && typeof budgets.approval === 'string' && budgets.approval.trim(), 'Missing owner approval reference');
        for (const key of ['browser', 'node', 'platform']) assert.equal(after[key], budgets.environment[key], `Budget environment mismatch: ${key}`);
        assert.deepEqual(conditions(after), conditions(budgets.environment), 'Budget environment mismatch: conditions');
        assert.ok(Object.keys(budgets.maximums).length > 0, 'No approved maxima');
        result.approval = { approvedBy: budgets.approvedBy, approval: budgets.approval };
        result.violations = [];
        for (const [metric, maximum] of Object.entries(budgets.maximums)) {
            assert.ok(Object.hasOwn(metricSources, metric), `Unknown budget metric: ${metric}`);
            assert.ok(Number.isFinite(maximum) && maximum >= 0, `Invalid maximum for ${metric}`);
            for (const viewport of result.after.widths) {
                const actual = viewport.metrics[metric];
                assert.ok(Number.isFinite(actual), `Missing ${metric} at ${viewport.width}px`);
                if (actual > maximum) result.violations.push({ width: viewport.width, metric, actual, maximum });
            }
        }
        result.budgetStatus = result.violations.length ? 'breach' : 'pass';
        result.note = 'Diagnostic event-to-render proxies, not INP. Shift sums are not Web Vitals CLS. Absolute approved maxima apply independently at every viewport; baseline deltas are informational.';
        process.exitCode = result.violations.length ? 1 : 0;
    }
    const output = JSON.stringify(result, null, 2) + '\n';
    if (values.report) fs.writeFileSync(values.report, output);
    process.stdout.write(output);
} catch (error) {
    console.error(error.message);
    process.exitCode = 2;
}
