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
            // Exercise existing opt-out defaults without sending optional telemetry.
            await privacy.route('**/*', route => new URL(route.request().url()).origin === new URL(values.url).origin
                ? route.continue() : route.abort());
            const page = await privacy.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(values.url, { waitUntil: 'networkidle' });
            const dialog = page.getByRole('dialog', { name: 'Privacy settings' });
            const settings = page.getByRole('button', { name: 'Privacy settings', exact: true });
            const analytics = page.getByRole('checkbox', { name: 'Vercel Analytics', exact: true });
            await expect(dialog).toBeVisible();
            for (const checkbox of await dialog.getByRole('checkbox').all()) await expect(checkbox).toBeChecked();
            await dialog.press('Escape');
            await expect(dialog).toHaveCount(0);
            await settings.click();
            for (const checkbox of await dialog.getByRole('checkbox').all()) await expect(checkbox).not.toBeChecked();
            const reject = dialog.getByRole('button', { name: 'Reject all' });
            await reject.focus();
            await page.keyboard.press('Tab');
            await expect(analytics).toBeFocused();
            await page.keyboard.press('Shift+Tab');
            await expect(reject).toBeFocused();
            await analytics.check();
            await dialog.getByRole('button', { name: 'Save choices' }).click();
            await expect(settings).toBeFocused();
            await page.reload({ waitUntil: 'networkidle' });
            await expect(settings).toBeVisible();
            await expect(dialog).toHaveCount(0);
            await settings.click();
            await expect(analytics).toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'Vercel Speed Insights', exact: true })).not.toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'Microsoft Clarity session insights', exact: true })).not.toBeChecked();
            await reject.click();
            assert.deepEqual(errors, []);
            console.log('PASS consent defaults, Escape rejection, focus trap/return, save and reload');
        } finally { await privacy.close(); }

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
