// Production before/after comparison: npm run build && npm start -- --port 9350
// node scripts/projects-benchmark.cjs --report=C:/path/to/before.json
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS check, matching scripts/*.cjs. */
const fs = require('node:fs');
const { parseArgs } = require('node:util');
const { chromium, expect } = require('@playwright/test');

const { values } = parseArgs({ options: {
    url: { type: 'string', default: 'http://localhost:9350' },
    report: { type: 'string' },
} });
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
        window.benchmark = { shifts: 0, allShifts: 0, inputs: [], commands: [] };
        new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                window.benchmark.allShifts += entry.value;
                if (!entry.hadRecentInput) window.benchmark.shifts += entry.value;
            }
        }).observe({ type: 'layout-shift', buffered: true });
        document.addEventListener('input', event => {
            if (event.target.getAttribute('aria-label') !== 'Terminal input') return;
            const start = performance.now();
            requestAnimationFrame(() => requestAnimationFrame(() => {
                window.benchmark.inputs.push(performance.now() - start);
            }));
        }, true);
        document.addEventListener('keydown', event => {
            if (event.key !== 'Enter' || event.target.getAttribute('aria-label') !== 'Terminal input') return;
            const start = performance.now(), command = event.target.value;
            const previous = sessionStorage.getItem('terminal_history');
            const paint = () => {
                if (sessionStorage.getItem('terminal_history') === previous) {
                    requestAnimationFrame(paint);
                } else {
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        window.benchmark.commands.push({ command, ms: performance.now() - start });
                    }));
                }
            };
            requestAnimationFrame(paint);
        }, true);
    });
}

(async () => {
    const browser = await chromium.launch({ executablePath, headless: true });
    const results = { browser: browser.version(), conditions: {
        cache: 'disabled; fresh context per run', cpuSlowdown: 4,
        latencyMs: 80, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750,
        deviceScaleFactor: 1, reducedMotion: 'reduce', runsPerViewport: 3,
        note: 'Double-RAF event-to-paint proxies, not INP. Local production server; optional telemetry disabled.',
    }, runs: [] };
    try {
        for (const width of [390, 900, 1600]) {
            for (let run = 1; run <= 3; run++) {
                const context = await browser.newContext({ viewport: { width, height: 900 },
                    deviceScaleFactor: 1, reducedMotion: 'reduce' });
                const page = await context.newPage();
                const cdp = await context.newCDPSession(page);
                await cdp.send('Network.enable');
                await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
                await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 80,
                    downloadThroughput: 200000, uploadThroughput: 93750 });
                await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
                const transfers = [], urls = new Map();
                cdp.on('Network.requestWillBeSent', e => urls.set(e.requestId, e.request.url));
                cdp.on('Network.loadingFinished', e => transfers.push({ url: urls.get(e.requestId), bytes: e.encodedDataLength }));
                await instrument(page);
                await page.goto(values.url, { waitUntil: 'networkidle' });
                await expect(page.getByRole('button', { name: 'projects', exact: true })).toBeVisible();
                const initialTransfers = [...transfers];
                const input = page.getByRole('textbox', { name: 'Terminal input' });
                // Include a populated history and repeated project outputs.
                for (const command of ['projects', 'pwd', 'portfolio', 'about', 'projects', 'contact']) {
                    await input.pressSequentially(command, { delay: 35 });
                    const count = await page.evaluate(() => window.benchmark.commands.length);
                    await input.press('Enter');
                    await page.waitForFunction(n => window.benchmark.commands.length > n, count);
                    await page.waitForLoadState('networkidle');
                }
                const metrics = await page.evaluate(() => ({
                    ...window.benchmark,
                    navigation: performance.getEntriesByType('navigation').map(e => ({
                        domContentLoadedMs: e.domContentLoadedEventEnd, loadMs: e.loadEventEnd,
                    }))[0],
                    firstContentfulPaintMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
                    images: performance.getEntriesByType('resource').filter(e => e.initiatorType === 'img')
                        .map(e => ({ url: e.name, transferBytes: e.transferSize, bodyBytes: e.encodedBodySize })),
                }));
                results.runs.push({ width, run, ...metrics, initialTransfers, transfers });
                console.log(`Measured ${width}px run ${run}: ${metrics.commands.map(e => `${e.command}=${e.ms.toFixed(1)}ms`).join(', ')}`);
                await context.close();
            }
        }
        if (values.report) fs.writeFileSync(values.report, JSON.stringify(results, null, 2));
        else console.log(JSON.stringify(results, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
