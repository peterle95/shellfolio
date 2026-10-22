/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node checks, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib/terminal/history-store.ts'), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;

function historySession() {
    const storage = new Map();
    const compiled = { exports: {} };
    vm.runInNewContext(source, {
        module: compiled, exports: compiled.exports, window: {}, console,
        sessionStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, value),
        },
    });
    return () => new compiled.exports.HistoryStore();
}

test('recalls the latest saved command immediately after reload', () => {
    const createStore = historySession();
    createStore().push({ command: 'pwd', output: 'Previous rendered output' });
    const restored = createStore();
    assert.equal(restored.prev(), 'pwd');
});

test('traverses restored nonempty commands in order and stops at both boundaries', () => {
    const createStore = historySession();
    const original = createStore();
    for (const command of ['pwd', '', 'projects', '   ', 'about']) original.push({ command, output: '' });
    const restored = createStore();
    assert.equal(restored.next(), '');
    assert.deepEqual(Array.from({ length: 4 }, () => restored.prev()), ['about', 'projects', 'pwd', 'pwd']);
    assert.deepEqual(Array.from({ length: 4 }, () => restored.next()), ['projects', 'about', '', '']);
    assert.equal(restored.prev(), 'about');
    restored.resetNavigation();
    assert.equal(restored.prev(), 'about');
});

test('blank submissions keep the latest command reachable without extra Up presses', () => {
    const store = historySession()();
    store.push({ command: 'pwd', output: '' });
    for (const command of ['', '   ']) {
        store.push({ command, output: '' });
        assert.equal(store.prev(), 'pwd');
    }
    store.push({ command: 'about', output: '' });
    assert.equal(store.prev(), 'about');
    assert.equal(store.prev(), 'pwd');
});

test('empty, blank-only and cleared histories navigate without errors', () => {
    const createStore = historySession();
    for (const store of [createStore(), createStore()]) {
        assert.equal(store.prev(), null);
        assert.equal(store.next(), null);
    }
    const store = createStore();
    store.push({ command: '   ', output: '' });
    const blankOnly = createStore();
    assert.equal(blankOnly.prev(), null);
    assert.equal(blankOnly.next(), '');
    blankOnly.push({ command: 'pwd', output: '/' });
    blankOnly.clear();
    for (const empty of [blankOnly, createStore()]) {
        assert.equal(empty.prev(), null);
        assert.equal(empty.next(), null);
    }
});

test('reload restores commands and metadata but not rendered output', () => {
    const createStore = historySession();
    const original = createStore();
    original.push({ command: 'projects', output: 'Previous rendered output and playback state' });
    const saved = original.getAll()[0];
    const restored = createStore();
    assert.equal(restored.getAll().length, 1);
    const item = restored.getAll()[0];
    assert.equal(item.command, 'projects');
    assert.equal(item.id, saved.id);
    assert.equal(item.timestamp, saved.timestamp);
    assert.equal(item.output, '');
    assert.equal(restored.prev(), 'projects');
});
