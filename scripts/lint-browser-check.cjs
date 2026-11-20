// Run after npm run build/start: node scripts/lint-browser-check.cjs --url=http://localhost:9350
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS browser check, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { parseArgs } = require('node:util');
const { chromium, expect } = require('@playwright/test');

const { values } = parseArgs({ options: { url: { type: 'string', default: 'http://localhost:9350' } } });
const executablePath = process.env.BROWSER_PATH || [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(file => fs.existsSync(file));

(async () => {
    const browser = await chromium.launch({ executablePath, headless: true });
    try {
        const privacy = await browser.newContext({ reducedMotion: 'reduce' });
        try {
            // Exercise opt-in defaults without sending optional telemetry.
            await privacy.route('**/*', route => new URL(route.request().url()).origin === new URL(values.url).origin
                ? route.continue() : route.abort());
            const page = await privacy.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(values.url, { waitUntil: 'networkidle' });
            const dialog = page.getByRole('dialog', { name: 'Privacy & Security' });
            const settings = page.getByRole('button', { name: 'Privacy & Security', exact: true });
            const analytics = page.getByRole('checkbox', { name: 'Vercel Analytics', exact: true });
            await expect(dialog).toBeVisible();
            for (const checkbox of await dialog.getByRole('checkbox').all()) await expect(checkbox).not.toBeChecked();
            await dialog.press('Escape');
            await expect(dialog).toHaveCount(0);
            await expect(settings).toBeFocused();
            await settings.click();
            for (const checkbox of await dialog.getByRole('checkbox').all()) await expect(checkbox).not.toBeChecked();
            const reject = dialog.getByRole('button', { name: 'Reject all' });
            const securityLink = dialog.getByRole('link', { name: 'Security details' });
            await expect(dialog.getByRole('link', { name: 'moelzerpeter@proton.me' })).toHaveAttribute('href', 'mailto:moelzerpeter@proton.me');
            await expect(securityLink).toHaveAttribute('href', '/security');
            await securityLink.focus();
            await page.keyboard.press('Tab');
            await expect(analytics).toBeFocused();
            await page.keyboard.press('Shift+Tab');
            await expect(securityLink).toBeFocused();
            await analytics.check();
            await dialog.getByRole('button', { name: 'Save choices' }).click();
            await expect(settings).toBeVisible();
            await expect(settings).toBeFocused();
            await page.reload({ waitUntil: 'networkidle' });
            await expect(settings).toBeVisible();
            await expect(dialog).toHaveCount(0);
            await settings.click();
            await expect(analytics).toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'Vercel Speed Insights', exact: true })).not.toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'Microsoft Clarity session insights', exact: true })).not.toBeChecked();
            await reject.click();
            await expect(settings).toBeFocused();
            await settings.press('Enter');
            for (const checkbox of await dialog.getByRole('checkbox').all()) await expect(checkbox).not.toBeChecked();
            await expect(analytics).toBeFocused();
            await analytics.check();
            await dialog.press('Escape');
            await expect(dialog).toHaveCount(0);
            await expect(settings).toBeFocused();
            await page.reload({ waitUntil: 'networkidle' });
            await settings.click();
            for (const checkbox of await dialog.getByRole('checkbox').all()) await expect(checkbox).not.toBeChecked();
            await reject.click();
            await expect(settings).toBeFocused();
            assert.deepEqual(errors, []);
            console.log('PASS consent defaults, focus trap, focus return after Save/Reject/Escape, saved choices and reload');
        } finally { await privacy.close(); }

        const security = await browser.newContext({ reducedMotion: 'reduce' });
        try {
            const page = await security.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(new URL('/security', values.url).href, { waitUntil: 'networkidle' });
            await expect(page.getByRole('heading', { level: 1, name: 'Security' })).toBeVisible();
            for (const name of ['Reporting a vulnerability', 'Encryption', 'Hosting and data location', 'Access controls', 'Incident history', 'Penetration testing', 'Certifications']) {
                await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
            }
            await page.goto(new URL('/privacy-policy', values.url).href, { waitUntil: 'networkidle' });
            await expect(page.getByRole('link', { name: 'security page' })).toHaveAttribute('href', '/security');
            const txt = await page.request.get(new URL('/.well-known/security.txt', values.url).href);
            assert.equal(txt.status(), 200);
            const body = await txt.text();
            assert.match(body, /^Contact: mailto:moelzerpeter@proton\.me$/m);
            assert.match(body, /^Expires: \d{4}-\d{2}-\d{2}T/m);
            assert.ok(new Date(body.match(/^Expires: (.+)$/m)[1]) > new Date(), 'security.txt Expires is in the past');
            assert.deepEqual(errors, []);
            console.log('PASS security page sections, privacy policy link, security.txt contact and expiry');
        } finally { await security.close(); }

        const graphics = await browser.newContext({ viewport: { width: 1600, height: 900 }, reducedMotion: 'no-preference' });
        try {
            await graphics.addInitScript(() => localStorage.setItem('shellfolio_privacy_consent', JSON.stringify({
                analytics: false, performance: false, clarity: false, updatedAt: Date.now(),
            })));
            const page = await graphics.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(values.url, { waitUntil: 'networkidle' });
            const badge = page.locator('[data-badge-ready]');
            await expect(badge).toHaveAttribute('data-badge-ready', 'true', { timeout: 60000 });
            await expect(badge.locator('canvas')).toBeVisible();
            await page.setViewportSize({ width: 1440, height: 900 });
            await expect(badge.locator('canvas')).toBeVisible();
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await expect(badge.locator('canvas')).toHaveCount(0);
            await expect(badge).toHaveAttribute('data-badge-ready', 'false');
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await expect(badge).toHaveAttribute('data-badge-ready', 'true', { timeout: 60000 });
            assert.deepEqual(errors, []);
            console.log('PASS real Badge renderer readiness, resize and reduced-motion teardown/re-enable');
        } finally { await graphics.close(); }
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
