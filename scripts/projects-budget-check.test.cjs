/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CLI checks, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const original = 'docs/evidence/projects-39/original-37';
function check(...args) {
    return spawnSync(process.execPath, ['scripts/projects-budget-check.cjs', ...args], {
        cwd: root, encoding: 'utf8',
    });
}

function captures(t, change, maximums) {
    const temporary = process.platform === 'win32' ? path.join(process.env.LOCALAPPDATA, 'Temp', 'opencode') : os.tmpdir();
    const directory = fs.mkdtempSync(path.join(temporary, 'projects-budget-test-'));
    t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
    const before = JSON.parse(fs.readFileSync(path.join(root, original, 'before.json'), 'utf8'));
    const after = JSON.parse(fs.readFileSync(path.join(root, original, 'after.json'), 'utf8'));
    change(before, after);
    fs.writeFileSync(path.join(directory, 'before.json'), JSON.stringify(before));
    fs.writeFileSync(path.join(directory, 'after.json'), JSON.stringify(after));
    const args = [`--before=${directory}/before.json`, `--after=${directory}/after.json`];
    if (maximums) {
        fs.writeFileSync(path.join(directory, 'budgets.json'), JSON.stringify({
            approvedBy: 'test-fixture-only', approval: 'Synthetic approval for CLI tests, not a production budget',
            environment: { browser: after.browser, node: after.node, platform: after.platform, conditions: after.conditions },
            maximums,
        }));
        args.push(`--budgets=${directory}/budgets.json`);
    }
    return args;
}

test('summarizes matched captures without claiming an approved budget', () => {
    const result = check(`--before=${original}/before.json`, `--after=${original}/after.json`);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.budgetStatus, 'not-evaluated');
    const phone = report.after.widths.find(viewport => viewport.width === 390);
    assert.equal(phone.statistics.inputMs.samples, 144);
    assert.equal(phone.statistics.firstProjectsMs.samples, 3);
    assert.equal(phone.statistics.repeatedProjectsMs.samples, 9);
    assert.equal(phone.statistics.loadingInputMs.samples, 42);
    assert.equal(phone.statistics.loadingCommandMs.samples, 6);
    assert.equal(report.before.widths.find(viewport => viewport.width === 1600).metrics.posterBodyMaxBytes, null);
    assert.equal(report.after.widths.find(viewport => viewport.width === 1600).metrics.posterBodyMaxBytes, 10204);
});

test('rejects comparisons with different throttling conditions', t => {
    const args = captures(t, before => { before.conditions.cpuSlowdown = 1; });
    const result = check(...args);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /conditions/);
});

test('rejects a partial batch instead of reducing the sample count', t => {
    const args = captures(t, (_, after) => { after.runs.pop(); });
    const result = check(...args);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /runs/);
});

test('rejects empty or truncated transfer snapshots against the retained trace', t => {
    for (const change of [
        (_, after) => { for (const run of after.runs) run.beforePlay = []; },
        (_, after) => { after.runs[0].beforePlay.pop(); },
        before => { before.runs[0].beforePlay.pop(); },
    ]) {
        const result = check(...captures(t, change));
        assert.equal(result.status, 2);
        assert.match(result.stderr, /transfer|trace/);
    }
});

test('rejects incomplete journeys, invalid timings and missing media evidence', t => {
    const corruptions = [
        after => after.runs[0].commands.pop(),
        after => { after.runs[0].inputs[0].ms = null; },
        after => { after.runs[0].beforePlay[0].endMs = null; },
        after => { after.runs[0].beforePlay[0].transferBytes = -1; },
        after => after.runs[0].beforePlay.push({ url: 'http://localhost/early.mp4', transferBytes: 0, endMs: 1 }),
        after => { after.runs[0].playback = null; },
        after => { after.runs[0].playback.inputs.find(sample => sample.phase === 'video-loading').duringVideoRequest = false; },
        after => { after.runs[0].transfers.find(request => request.url.endsWith('.mp4')).url = 'http://localhost/videos/unapproved.mp4'; },
    ];
    for (const corrupt of corruptions) {
        const args = captures(t, (_, after) => corrupt(after));
        const result = check(...args);
        assert.equal(result.status, 2, `Invalid evidence accepted: ${corrupt.toString()}`);
    }
});

test('uses pooled nearest-rank p95 and medians, accepts equality and fails a breach', t => {
    const change = (_, after) => {
        for (const run of after.runs) {
            run.inputs.filter(sample => sample.phase === 'journey').forEach((sample, index) => { sample.ms = index + 1; });
            run.commands.find(sample => sample.phase === 'journey').ms = [1, 2, 1000][run.run - 1];
        }
    };
    const atLimit = check(...captures(t, change, { inputP95Ms: 46, firstProjectsMedianMs: 2 }));
    assert.equal(atLimit.status, 0, atLimit.stderr);
    const report = JSON.parse(atLimit.stdout);
    assert.equal(report.budgetStatus, 'pass');
    assert.equal(report.after.widths[0].statistics.inputMs.p50, 24.5);
    assert.equal(report.after.widths[0].metrics.inputP95Ms, 46);
    assert.equal(report.after.widths[0].metrics.firstProjectsMedianMs, 2);
    const exceeded = check(...captures(t, change, { inputP95Ms: 45.99 }));
    assert.equal(exceeded.status, 1, exceeded.stderr);
    const failure = JSON.parse(exceeded.stdout);
    assert.equal(failure.budgetStatus, 'breach');
    assert.deepEqual(failure.violations.map(violation => violation.width), [390, 900, 1600]);
});

test('rejects missing environment metadata even when both captures omit it', t => {
    const args = captures(t, (before, after) => { delete before.browser; delete after.browser; });
    const result = check(...args);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /browser/);
});

test('rejects unapproved, misspelled and incompatible limits', t => {
    for (const change of [
        budgets => { budgets.approvedBy = ''; },
        budgets => { budgets.maximums = { inputP59Ms: 200 }; },
        budgets => { budgets.environment.conditions.runsPerViewport = 99; },
    ]) {
        const args = captures(t, () => {}, { inputP95Ms: 200 });
        const file = args.find(arg => arg.startsWith('--budgets=')).slice('--budgets='.length);
        const budgets = JSON.parse(fs.readFileSync(file, 'utf8'));
        change(budgets);
        fs.writeFileSync(file, JSON.stringify(budgets));
        const result = check(...args);
        assert.equal(result.status, 2);
    }
});
