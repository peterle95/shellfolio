// Production before/after comparison: npm run build && npm start -- --port 9350
// node scripts/projects-benchmark.cjs --report=C:/path/to/before.json
// Use --baseline only for the pre-feature build. Run targets sequentially, not concurrently.
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS check, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { parseArgs } = require('node:util');
const { chromium, expect } = require('@playwright/test');

const { values } = parseArgs({ options: {
    url: { type: 'string', default: 'http://localhost:9350' },
    report: { type: 'string' },
    baseline: { type: 'boolean', default: false },
    runs: { type: 'string', default: '3' },
    widths: { type: 'string', default: '390,900,1600' },
    revision: { type: 'string' },
} });
const runs = Number(values.runs), widths = values.widths.split(',').map(Number);
assert.ok(Number.isInteger(runs) && runs > 0, '--runs must be a positive integer');
assert.ok(widths.every(width => Number.isInteger(width) && width >= 320), '--widths must list viewport widths >= 320');
const executablePath = process.env.BROWSER_PATH || [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(file => fs.existsSync(file));

async function instrument(page) {
    await page.addInitScript(() => {
        // Keep optional telemetry out of both measurements, without changing the app.
        localStorage.setItem('shellfolio_privacy_consent', JSON.stringify({
            analytics: false, performance: false, clarity: false, updatedAt: Date.now(),
        }));
        window.benchmark = { phase: 'initial', shifts: 0, allShifts: 0, shiftEntries: [], inputs: [], commands: [], plays: [], playing: [] };
        new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                window.benchmark.allShifts += entry.value;
                if (!entry.hadRecentInput) window.benchmark.shifts += entry.value;
                window.benchmark.shiftEntries.push({ startMs: entry.startTime, value: entry.value, hadRecentInput: entry.hadRecentInput });
            }
        }).observe({ type: 'layout-shift', buffered: true });
        document.addEventListener('input', event => {
            if (event.target.getAttribute('aria-label') !== 'Terminal input') return;
            const start = performance.now(), phase = window.benchmark.phase;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                window.benchmark.inputs.push({ phase, startMs: start, ms: performance.now() - start });
            }));
        }, true);
        document.addEventListener('keydown', event => {
            if (event.key !== 'Enter' || event.target.getAttribute('aria-label') !== 'Terminal input') return;
            const start = performance.now(), command = event.target.value, phase = window.benchmark.phase;
            // Both revisions have this scroll container; the baseline predates its ARIA name.
            // Observe rendered output insertion, not the earlier sessionStorage write.
            const history = event.target.closest('.overflow-y-auto').firstElementChild;
            const previous = history.childElementCount;
            const paint = () => {
                if (history.childElementCount === previous) {
                    if (performance.now() - start > 30000) return;
                    requestAnimationFrame(paint);
                } else {
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        window.benchmark.commands.push({ phase, command, startMs: start, ms: performance.now() - start });
                    }));
                }
            };
            requestAnimationFrame(paint);
        }, true);
        document.addEventListener('click', event => {
            if (event.target.closest('button[aria-label^="Play shared placeholder video"]')) window.benchmark.plays.push(performance.now());
        }, true);
        document.addEventListener('playing', event => {
            if (event.target instanceof HTMLVideoElement) window.benchmark.playing.push(performance.now());
        }, true);
    });
}

async function send(page, command) {
    const input = page.getByRole('textbox', { name: 'Terminal input' });
    await input.pressSequentially(command, { delay: 35 });
    const count = await page.evaluate(() => window.benchmark.commands.length);
    await input.press('Enter');
    await page.waitForFunction(n => window.benchmark.commands.length > n, count);
}
const phase = (page, name) => page.evaluate(name => { window.benchmark.phase = name; }, name);
const videoURL = url => /\.(mp4|webm)(?:[?#]|$)/i.test(url);

(async () => {
    const browser = await chromium.launch({ executablePath, headless: true });
    const results = { measuredAt: new Date().toISOString(), url: values.url, revision: values.revision,
        baseline: values.baseline, browser: browser.version(), node: process.version, platform: process.platform, conditions: {
        cache: 'disabled; fresh context per run', cpuSlowdown: 4,
        latencyMs: 80, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750,
        deviceScaleFactor: 1, reducedMotion: 'reduce', runsPerViewport: runs, viewportHeight: 900, widths,
        historySeed: Array(5).fill('pwd'),
        journey: ['projects', 'pwd', 'portfolio', 'about', 'projects', 'contact', 'projects'],
        note: 'Input-to-double-RAF and Enter-to-rendered-history-plus-double-RAF command proxies, not INP. Local production server; optional telemetry disabled. Shift sums are not windowed CLS. Incomplete receivedEncodedBytes exclude response headers.',
    }, runs: [] };
    try {
        for (const width of widths) {
            for (let run = 1; run <= runs; run++) {
                const context = await browser.newContext({ viewport: { width, height: 900 },
                    deviceScaleFactor: 1, reducedMotion: 'reduce' });
                const page = await context.newPage();
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                page.setDefaultTimeout(60000);
                const cdp = await context.newCDPSession(page);
                await cdp.send('Network.enable');
                await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
                await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 80,
                    downloadThroughput: 200000, uploadThroughput: 93750 });
                await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
                await cdp.send('Performance.enable');
                const requests = new Map();
                cdp.on('Network.requestWillBeSent', e => requests.set(e.requestId, {
                    url: e.request.url, type: e.type, start: e.timestamp,
                    range: e.request.headers.Range, receivedEncodedBytes: 0,
                }));
                cdp.on('Network.responseReceived', e => Object.assign(requests.get(e.requestId) || {}, {
                    response: e.timestamp, status: e.response.status, mimeType: e.response.mimeType,
                    contentRange: e.response.headers['Content-Range'],
                }));
                cdp.on('Network.dataReceived', e => {
                    const request = requests.get(e.requestId);
                    if (request) request.receivedEncodedBytes += e.encodedDataLength;
                });
                cdp.on('Network.loadingFinished', e => Object.assign(requests.get(e.requestId) || {}, {
                    end: e.timestamp, transferBytes: e.encodedDataLength,
                }));
                cdp.on('Network.loadingFailed', e => Object.assign(requests.get(e.requestId) || {}, {
                    end: e.timestamp, error: e.errorText, cancelled: e.canceled,
                }));
                await instrument(page);
                await page.goto(values.url, { waitUntil: 'networkidle' });
                await expect(page.getByRole('button', { name: 'projects', exact: true })).toBeVisible();
                const clock = (await cdp.send('Performance.getMetrics')).metrics.find(m => m.name === 'NavigationStart').value;
                const transfers = () => [...requests.values()].map(({ start, response, end, ...request }) => ({
                    ...request, startMs: (start - clock) * 1000,
                    responseStartMs: response == null ? null : (response - clock) * 1000,
                    endMs: end == null ? null : (end - clock) * 1000,
                }));
                const initialTransfers = transfers();
                await phase(page, 'populated-history');
                for (const command of results.conditions.historySeed) await send(page, command);
                await phase(page, 'journey');
                for (const command of results.conditions.journey) {
                    await send(page, command);
                    await page.waitForLoadState('networkidle');
                }
                const metrics = await page.evaluate(() => ({
                    ...window.benchmark,
                    navigation: performance.getEntriesByType('navigation').map(e => ({
                        domContentLoadedMs: e.domContentLoadedEventEnd, loadMs: e.loadEventEnd,
                    }))[0],
                    firstContentfulPaintMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
                    images: performance.getEntriesByType('resource').filter(e => e.initiatorType === 'img')
                        .map(e => ({ url: e.name, transferBytes: e.transferSize, bodyBytes: e.encodedBodySize,
                            startMs: e.startTime, responseStartMs: e.responseStart, durationMs: e.duration })),
                }));
                const beforePlay = transfers();
                assert.equal(beforePlay.some(request => videoURL(request.url)), false, 'no video requests before Play');
                let playback = null;
                if (!values.baseline) {
                    const article = page.getByRole('region', { name: 'Projects', exact: true }).last().getByRole('article').first();
                    const play = article.getByRole('button', { name: /^Play shared placeholder video/ });
                    await expect(play).toBeVisible();
                    assert.equal(await page.locator('video[src], video source[src]').count(), 0);
                    const height = (await article.boundingBox()).height;
                    await phase(page, 'video-loading');
                    await play.click();
                    await expect.poll(() => [...requests.values()].some(request => videoURL(request.url))).toBe(true);
                    // No routing/delay mock: type and execute while the actual throttled MP4 is in flight.
                    for (const command of ['pwd', 'ls projects']) await send(page, command);
                    const player = article.locator('video');
                    await expect.poll(() => player.evaluate(el => !el.paused && el.currentTime > 0)).toBe(true);
                    await expect.poll(() => [...requests.values()].filter(request => videoURL(request.url))
                        .every(request => request.end != null), { timeout: 60000 }).toBe(true);
                    assert.equal((await article.boundingBox()).height, height, 'stable geometry during actual loading/playback');
                    await expect(page.locator('video[src]')).toHaveCount(1);
                    playback = await page.evaluate(() => ({ ...window.benchmark }));
                    const media = transfers().filter(request => videoURL(request.url));
                    assert.ok(media.every(request => !request.error && request.transferBytes > 0), 'record successful video transfers, not failed requests');
                    for (const sample of [...playback.inputs, ...playback.commands]) {
                        sample.duringVideoRequest = media.some(request => sample.startMs >= request.startMs && sample.startMs <= request.endMs);
                    }
                    assert.ok(playback.inputs.some(sample => sample.duringVideoRequest), 'input measurement overlaps real video delivery');
                    assert.equal(playback.commands.filter(sample => sample.duringVideoRequest).length, 2, 'both commands execute during video delivery');
                    await phase(page, 'playback-cleanup');
                    await send(page, 'portfolio');
                    await expect(page.locator('video[src]')).toHaveCount(0);
                    await page.waitForLoadState('networkidle');
                    assert.equal(transfers().filter(request => videoURL(request.url)).length, media.length, 'repeated output must not start more video requests');
                }
                assert.deepEqual(errors, []);
                results.runs.push({ width, run, ...metrics, initialTransfers, beforePlay, playback, transfers: transfers() });
                console.log(`Measured ${width}px run ${run}: ${metrics.commands.filter(e => e.phase === 'journey').map(e => `${e.command}=${e.ms.toFixed(1)}ms`).join(', ')}${playback ? '; real video-loading input/commands and cleanup passed' : ''}`);
                await context.close();
            }
        }
        if (values.report) fs.writeFileSync(values.report, JSON.stringify(results, null, 2));
        else console.log(JSON.stringify(results, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
