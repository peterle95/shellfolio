// Run against production: npm run build && npm start -- --port 9350
// npm run test:projects -- --url=http://localhost:9350 --screenshots=C:/path/to/screenshots
// Uses BROWSER_PATH, installed Chrome/Edge on Windows, or `npx playwright install chromium`.
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS check, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { parseArgs } = require('node:util');
const React = require('react');
const { renderToString } = require('react-dom/server');
const ts = require('typescript');
const { chromium, expect } = require('@playwright/test');

const { values } = parseArgs({ options: {
    url: { type: 'string', default: 'http://localhost:9350' },
    screenshots: { type: 'string' },
} });
const root = path.resolve(__dirname, '..');
const cache = new Map();
function loadSource(base) {
    const file = [base, `${base}.ts`, `${base}.tsx`].find(f => fs.existsSync(f));
    if (cache.has(file)) return cache.get(file).exports;
    const compiled = { exports: {} };
    cache.set(file, compiled);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
        target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React, esModuleInterop: true,
    } }).outputText;
    const requireSource = name => {
        if (name.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
        if (name.startsWith('@/')) return loadSource(path.join(root, 'src', name.slice(2)));
        if (name.startsWith('.')) return loadSource(path.resolve(path.dirname(file), name));
        return require(name);
    };
    vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(requireSource, compiled, compiled.exports);
    return compiled.exports;
}
const data = loadSource(path.join(root, 'src/lib/portfolio-data.ts'));
const { portfolioContent } = loadSource(path.join(root, 'src/lib/terminal/vfs-content.ts'));
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
// Pre-feature public records and filenames, including their original link semantics.
assert.equal(hash(data.projectsAsRecords()), 'cf9aeb802b310b26bdbe1cc90c1f8ef8cd4f895ad37c069fffaefaa2f350af92');
assert.equal(hash(portfolioContent.children.projects), '790334d3e311242a04cf779c9306aa974228f73aca66da92da01e0952ff39d2d');
const approvedCopy = [
    'Track fermentation locally, on desktop or Android.',
    'Pro-bono WordPress fixes for animal listings and SEO.',
    '23 command-line tools for API automation.',
    'A multi-game platform built at 42, currently in development.',
    'A custom HTTP server built in C++98.',
    'An interactive portfolio styled as a command-line shell.',
    'Explore more projects and contributions on GitHub.',
];
assert.deepEqual(data.portfolioProjects.map(p => p.shortDescription), approvedCopy);
assert.ok(data.portfolioProjects.every(p => p.image?.src === '/videos/finance_tracker-poster.webp'));

const executablePath = process.env.BROWSER_PATH || [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(file => fs.existsSync(file));
const alt = data.portfolioProjects[0].image.alt;
let browser;
async function session(width = 1600) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
        localStorage.setItem('shellfolio_privacy_consent', JSON.stringify({
            analytics: false, performance: false, clarity: false, updatedAt: Date.now(),
        }));
    });
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on('request', request => requests.push(request.url()));
    page.on('pageerror', error => errors.push(error.message));
    return { context, page, requests, errors };
}
async function boot(page) {
    await page.goto(values.url, { waitUntil: 'networkidle' });
    await expect(page.getByRole('button', { name: 'projects', exact: true })).toBeVisible();
}
async function send(page, command) {
    const entries = page.locator('[data-terminal-entry]');
    const before = await entries.count();
    const input = page.getByRole('textbox', { name: 'Terminal input' });
    await input.fill(command);
    await input.press('Enter');
    await expect(entries).toHaveCount(command === 'clear' ? 1 : before + 1);
}
const projects = page => page.getByRole('region', { name: 'Projects', exact: true });
const viewport = page => page.getByRole('region', { name: 'Terminal history' });
async function noOverflow(page) {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    assert.ok(await viewport(page).evaluate(el => el.scrollWidth <= el.clientWidth), 'no clipped horizontal terminal content');
}
async function imageReady(image) {
    await expect.poll(() => image.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
}
async function screenshot(page, name) {
    if (!values.screenshots) return;
    fs.mkdirSync(values.screenshots, { recursive: true });
    await page.screenshot({ path: path.join(values.screenshots, `${name}.png`) });
}
function noVideo(requests) {
    assert.deepEqual(requests.filter(url => /\.(mp4|webm)(?:[?#]|$)/i.test(url)), []);
}

async function navigation() {
    for (const method of ['button', 'projects', 'portfolio']) {
        const { context, page, requests, errors } = await session();
        try {
            await boot(page);
            const normal = await viewport(page).boundingBox();
            await expect(page.locator('[data-badge-ready]')).toBeVisible();
            if (method === 'button') await page.getByRole('button', { name: 'projects', exact: true }).click();
            else await send(page, method);
            await expect(projects(page)).toHaveCount(1);
            const expanded = await viewport(page).boundingBox();
            assert.ok(expanded.width > normal.width + 300);
            await expect(page.locator('[data-badge-ready]')).toHaveCount(0);
            await expect(projects(page).getByRole('heading')).toHaveText(data.portfolioProjects.map(p => p.title));
            const first = await projects(page).getByRole('article').first().boundingBox();
            assert.ok(first.y >= expanded.y && first.y < expanded.y + 100, 'open at first card inside terminal');
            await send(page, 'pwd');
            assert.equal((await viewport(page).boundingBox()).width, expanded.width);
            // Every section alias must restore layout, without removing either project output.
            for (const section of ['about', 'education', 'jobs', 'resume', 'social', 'certs', 'help']) {
                await send(page, section);
                await expect(page.locator('[data-badge-ready]')).toBeVisible();
                assert.equal((await viewport(page).boundingBox()).width, normal.width);
                await expect(projects(page)).toHaveCount(1);
            }
            await send(page, 'portfolio');
            await expect(projects(page)).toHaveCount(2);
            assert.equal((await viewport(page).boundingBox()).width, expanded.width);
            const latest = await projects(page).last().getByRole('article').first().boundingBox();
            assert.ok(latest.y >= expanded.y && latest.y < expanded.y + 100);
            await send(page, 'contact');
            await expect(projects(page)).toHaveCount(2);
            assert.equal((await viewport(page).boundingBox()).width, normal.width);
            noVideo(requests);
            assert.deepEqual(errors, []);
        } finally { await context.close(); }
        console.log(`PASS navigation, restoration and retained history: ${method}`);
    }
}

async function responsive() {
    const selected = {};
    for (const width of [320, 390, 768, 900, 945, 960, 1024, 1399, 1400, 1600]) {
        const { context, page, requests, errors } = await session(width);
        try {
            await boot(page);
            await page.getByRole('button', { name: 'projects', exact: true }).click();
            const section = projects(page);
            await expect(section.getByRole('article')).toHaveCount(7);
            const sectionWidth = (await section.boundingBox()).width;
            for (const [index, project] of data.portfolioProjects.entries()) {
                const article = section.getByRole('article').nth(index);
                const short = article.getByText(project.shortDescription, { exact: true });
                const full = article.getByText(project.description, { exact: true });
                const stack = article.getByText(`Stack: ${project.stack}`, { exact: true });
                if (sectionWidth < 576) {
                    await expect(short).toBeVisible(); await expect(full).toBeHidden(); await expect(stack).toBeHidden();
                } else {
                    await expect(short).toBeHidden(); await expect(full).toBeVisible(); await expect(stack).toBeVisible();
                }
                const links = article.getByRole('link');
                const expected = [project.repo, project.live].filter(href => href && href !== '#');
                assert.deepEqual(await links.evaluateAll(els => els.map(el => el.getAttribute('href'))), expected);
                await expect(article.getByRole('img', { name: alt })).toHaveAttribute('loading', 'lazy');
                const copy = await article.locator(':scope > div').boundingBox();
                const media = await article.locator('figure').boundingBox();
                if (sectionWidth >= 832) {
                    assert.ok(media.x >= copy.x + copy.width, 'text left, image right');
                    assert.ok(copy.width >= 350, 'readable text column at transition');
                } else assert.ok(media.y >= copy.y + copy.height, 'text above image');
            }
            const image = section.getByRole('img', { name: alt }).first();
            await imageReady(image);
            selected[width] = await image.evaluate(el => el.currentSrc);
            await expect(image).toHaveAttribute('width', '1280');
            await expect(image).toHaveAttribute('height', '720');
            const box = await image.boundingBox();
            assert.ok(Math.abs(box.width / box.height - 16 / 9) < 0.01);
            await noOverflow(page);
            if ([390, 900, 1600].includes(width)) await screenshot(page, `${width}-projects`);
            await image.scrollIntoViewIfNeeded();
            const before = await viewport(page).evaluate(el => el.scrollTop);
            await image.click();
            assert.equal(await viewport(page).evaluate(el => el.scrollTop), before, 'preview click must not jump to prompt');
            await viewport(page).focus();
            await page.keyboard.press('End');
            await expect.poll(() => viewport(page).evaluate(el => el.scrollTop)).toBeGreaterThan(before);
            // Empty prompt does not trap Tab; links retain native focus and activation.
            await page.getByRole('textbox', { name: 'Terminal input' }).focus();
            await page.keyboard.press('Shift+Tab');
            await expect(section.getByRole('link').last()).toBeFocused();
            const link = section.getByRole('link').first();
            await link.focus();
            assert.equal(await link.evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
            await context.route('https://github.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Link destination</title>' }));
            const popupPromise = page.waitForEvent('popup');
            await link.press('Enter');
            const popup = await popupPromise;
            await popup.close();
            noVideo(requests);
            assert.deepEqual(errors, []);
        } finally { await context.close(); }
        console.log(`PASS responsive content, geometry, scroll and keyboard: ${width}px`);
    }
    const smallWidth = new URL(selected[390]).searchParams.get('w');
    const largeWidth = new URL(selected[1600]).searchParams.get('w');
    assert.ok(Number(smallWidth) < Number(largeWidth), 'real optimizer requests select different widths');
    console.log('Selected production image URLs:', JSON.stringify(selected));
}

async function delayedAndBroken() {
    for (const broken of [false, true]) {
        const { context, page, requests, errors } = await session(390);
        let release;
        const pending = new Promise(resolve => { release = resolve; });
        try {
            await page.route('**/_next/image?**', async route => {
                await pending;
                if (broken) await route.abort(); else await route.continue();
            });
            await boot(page);
            await page.getByRole('button', { name: 'projects', exact: true }).click();
            const article = projects(page).getByRole('article').first();
            await expect(article).toBeVisible();
            const before = await article.boundingBox();
            const image = article.getByRole('img', { name: alt });
            assert.equal(await image.evaluate(el => el.naturalWidth), 0);
            await page.getByRole('textbox', { name: 'Terminal input' }).fill('pwd');
            await expect(page.getByRole('textbox', { name: 'Terminal input' })).toHaveValue('pwd');
            await send(page, 'pwd'); // Must complete while image response remains blocked.
            release();
            if (broken) await expect(article.getByText('Preview unavailable. Project details and links are still available.')).toBeVisible();
            else await imageReady(image);
            const after = await article.boundingBox();
            assert.equal(after.height, before.height, 'loading/failure must preserve reserved geometry');
            await expect(article.getByRole('heading', { name: 'FermentStation' })).toBeVisible();
            await expect(article.getByRole('link')).toHaveCount(1);
            noVideo(requests);
            assert.deepEqual(errors, []);
        } finally { release(); await context.close(); }
        console.log(`PASS nonblocking input/commands and stable geometry: ${broken ? 'broken image' : 'delayed image'}`);
    }
}

async function optionalMediaFixture() {
    // The approved release has media on every entry. Exercise the same production
    // renderer with optional media omitted; no fixture route/flag ships in the app.
    const { ProjectsOutput } = loadSource(path.join(root, 'src/components/shellfolio/terminal/ProjectsOutput.tsx'));
    const fixture = Array.from({ length: 12 }, (_, i) => ({ ...data.portfolioProjects[0], title: `Image fixture ${i}` }));
    fixture.push({ ...data.portfolioProjects[0], title: 'Text-only fixture', image: undefined, repo: '#', live: '#' });
    let imageIndex = 0;
    const markup = renderToString(React.createElement(ProjectsOutput, { projects: fixture }))
        .replace(/<img\b[^>]*>/g, tag => {
            // Distinguish cache keys only in this fixture's markup. Every response
            // still comes from the real optimizer and the same approved local image.
            const index = imageIndex++;
            return tag.replaceAll('/_next/image?', `/_next/image?project-fixture=${index}&amp;`);
        });
    const css = fs.readFileSync(path.join(root, 'src/components/shellfolio/terminal/ProjectsOutput.module.css'), 'utf8');
    const { context, page, requests } = await session(1200);
    try {
        await boot(page);
        const stylesheets = await page.locator('link[rel="stylesheet"]').evaluateAll(els => els.map(el => el.href));
        await page.route('**/projects-fixture', route => route.fulfill({ contentType: 'text/html', body:
            `<html class="dark"><head>${stylesheets.map(href => `<link rel="stylesheet" href="${href}">`).join('')}<style>${css}</style></head>
            <body><main style="margin:16px;color:var(--terminal-fg)"><div role="region" aria-label="Terminal history" style="height:600px;overflow:auto">${markup}</div></main></body></html>` }));
        requests.length = 0;
        await page.goto(`${values.url}/projects-fixture`, { waitUntil: 'networkidle' });
        const images = projects(page).getByRole('img', { name: alt });
        await imageReady(images.first());
        assert.equal(requests.some(url => url.includes('project-fixture=11')), false, 'far-offscreen image not fetched');
        assert.equal(await images.last().evaluate(el => el.complete), false);
        await images.last().scrollIntoViewIfNeeded();
        await imageReady(images.last());
        assert.ok(requests.some(url => url.includes('project-fixture=11')), 'scrolling triggers actual optimized request');
        const textOnly = projects(page).getByRole('article').last();
        await expect(textOnly.locator('figure, img')).toHaveCount(0);
        await expect(textOnly.getByRole('link')).toHaveCount(0);
        const outer = await textOnly.boundingBox(), copy = await textOnly.locator(':scope > div').boundingBox();
        assert.ok(copy.width > outer.width - 40, 'text-only content spans the row, without an empty media column');
        await noOverflow(page);
        noVideo(requests);
    } finally { await context.close(); }
    console.log('PASS text-only full-width rendering and production lazy-image requests in representative fixture');
}

(async () => {
    browser = await chromium.launch({ executablePath, headless: true });
    console.log(`Browser ${browser.version()}; production target ${values.url}`);
    try {
        await navigation();
        await responsive();
        await delayedAndBroken();
        await optionalMediaFixture();
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
