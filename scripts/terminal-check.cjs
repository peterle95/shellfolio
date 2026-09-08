// Run: node scripts/terminal-check.cjs
// Execute the production provider, registry, lazy loaders and commands; mock React/browser/UI rendering.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}

function terminal() {
    const cache = new Map(), gates = new Map(), imports = [], errors = [];
    let slots = [], index = 0;
    const react = {
        createContext: () => ({ Provider: 'Provider' }),
        createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
        useState(initial) {
            const slot = index++;
            if (!(slot in slots)) slots[slot] = initial;
            const state = slots;
            return [state[slot], value => { state[slot] = value; }];
        },
        useRef(initial) {
            const slot = index++;
            if (!(slot in slots)) slots[slot] = { current: initial };
            return slots[slot];
        },
        useCallback: fn => fn,
        useEffect() {} // Fresh storage is empty; no mount hydration needed.
    };
    const storage = new Map();
    const context = vm.createContext({
        console: { ...console, error: (...args) => errors.push(args) },
        window: {},
        sessionStorage: { getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, value) }
    });
    function load(base) {
        const file = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]
            .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        assert.ok(file, `Cannot resolve ${base}`);
        if (cache.has(file)) return cache.get(file).exports;
        const module = { exports: {} };
        cache.set(file, module); // Preserve the help/index cycle.
        const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
            compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS,
                jsx: ts.JsxEmit.React, esModuleInterop: true }
        }).outputText;
        const requireSource = name => {
            if (name === 'react') return react;
            if (name.startsWith('@/components/')) {
                return new Proxy({}, { get: (_, key) => key }); // Inert element types, not command mocks.
            }
            const resolved = name.startsWith('@/')
                ? path.join(__dirname, '../src', name.slice(2))
                : path.resolve(path.dirname(file), name);
            if (file.endsWith(path.join('commands', 'index.ts')) && gates.has(name)) {
                const gate = gates.get(name);
                imports.push(name);
                gate.entered.resolve();
                // CommonJS-lowered import assimilates this promise (__importStar must leave it intact).
                return Object.assign(gate.release.promise.then(() => load(resolved)), { __esModule: true });
            }
            return load(resolved);
        };
        vm.runInContext(`(function(require, module, exports) { ${source}\n})`, context,
            { filename: file })(requireSource, module, module.exports);
        return module.exports;
    }
    const { TerminalProvider } = load(path.join(__dirname, '../src/lib/terminal/terminal-state'));
    function render(state = slots) {
        slots = state; index = 0;
        return TerminalProvider({}).props.value;
    }
    const api = render();
    return { api, render, imports, errors,
        commands: () => Array.from(api.historyStore.getAll(), entry => entry.command),
        gate(name) {
            const gate = { entered: deferred(), release: deferred() };
            gates.set(`./${name}`, gate);
            return gate;
        }
    };
}

const checks = {
    async 'slow projects then clear'() {
        const t = terminal(), gate = t.gate('projects');
        const first = t.api.executeCommand('projects');
        await gate.entered.promise;
        const clear = t.api.executeCommand('clear');
        gate.release.resolve();
        await Promise.all([first, clear]);
        assert.deepEqual(t.commands(), ['clear']); // Preserve the existing clear entry.
    },
    async 'lazy alias, fast command, empty input, second lazy alias'() {
        const t = terminal(), a = t.gate('projects'), b = t.gate('work');
        assert.deepEqual(t.imports, []);
        const first = t.api.executeCommand('portfolio');
        await a.entered.promise;
        const rest = ['pwd', '  ', 'jobs'].map(cmd => t.api.executeCommand(cmd));
        b.release.resolve();
        a.release.resolve();
        await Promise.all([first, ...rest]);
        assert.deepEqual(t.commands(), ['portfolio', 'pwd', '', 'jobs']);
        assert.deepEqual(t.imports, ['./projects', './work']);
        assert.equal(t.api.historyStore.getAll()[0].output.type, 'Projects');
        assert.equal(t.api.historyStore.getAll()[3].output.type, 'WorkExperience');
    },
    async 'queued cd uses latest cwd without a render'() {
        const t = terminal();
        await Promise.all(['cd /about', 'cd ../projects', 'pwd'].map(t.api.executeCommand));
        assert.equal(t.api.historyStore.getAll()[2].output.props.children[0], '/projects');
        assert.equal(t.render().cwd, '/projects');
        t.api.setCwd('/about');
        await t.api.executeCommand('pwd');
        assert.equal(t.api.historyStore.getAll()[3].output.props.children[0], '/about');
    },
    async 'lazy failure retains registry error and continues'() {
        const t = terminal(), gate = t.gate('projects');
        const first = t.api.executeCommand('projects');
        await gate.entered.promise;
        const next = t.api.executeCommand('pwd');
        gate.release.reject(new Error('load failed'));
        await Promise.all([first, next]);
        assert.deepEqual(t.commands(), ['projects', 'pwd']);
        assert.match(t.api.historyStore.getAll()[0].output, /load failed/);
        assert.equal(t.errors.length, 1);
    },
    async 'unexpected failure does not poison queue'() {
        const t = terminal(), store = t.api.historyStore, push = store.push;
        store.push = function (entry) { store.push = push; throw new Error('push failed'); };
        const failed = assert.rejects(t.api.executeCommand('pwd'), /push failed/);
        const next = t.api.executeCommand('pwd');
        await Promise.all([failed, next]);
        assert.deepEqual(t.commands(), ['pwd']);
    },
    async 'queue belongs to provider, not module singleton'() {
        const t = terminal(), gate = t.gate('projects');
        const first = t.api.executeCommand('projects');
        await gate.entered.promise;
        const other = t.render([]);
        // A global queue would stall this provider behind the unreleased import.
        let completed = false;
        const next = other.executeCommand('pwd').then(() => { completed = true; });
        await new Promise(resolve => setImmediate(resolve));
        assert.ok(completed, 'other provider must run while the first is gated');
        await next;
        assert.deepEqual(t.commands(), ['pwd']);
        gate.release.resolve();
        await first;
    }
};

(async () => {
    for (const [name, check] of Object.entries(checks)) {
        try { await check(); console.log(`PASS ${name}`); }
        catch (error) { process.exitCode = 1; console.error(`FAIL ${name}`, error); }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
