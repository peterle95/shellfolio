// Run: node scripts/grainient-check.cjs
// Execute the production component/effects; mock only React and browser/GPU boundaries.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync(
    require('node:path').join(__dirname, '../src/components/shellfolio/Grainient.tsx'), 'utf8'
), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;

function check({ mobile = false, reduced = false, saveData = false, hidden = false } = {}) {
    const targets = [];
    function target(extra = {}) {
        const listeners = new Map();
        const value = Object.assign({
            addEventListener(name, fn) {
                if (!listeners.has(name)) listeners.set(name, new Set());
                listeners.get(name).add(fn);
            },
            removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
            emit(name) { for (const fn of [...(listeners.get(name) || [])]) fn(); },
            count() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); }
        }, extra);
        targets.push(value);
        return value;
    }
    const motion = target({ matches: reduced });
    const device = target({ matches: mobile });
    const connection = target({ saveData });
    const document = target({ hidden });
    let resolution;
    const window = target({ devicePixelRatio: 3, matchMedia(query) {
        if (query.includes('prefers-reduced-motion')) return motion;
        if (query.includes('pointer')) return device;
        return resolution = target({ matches: true });
    } });
    let state = false, dirty = false, index = 0, now = 0, id = 0;
    let allocations = 0, removals = 0, lost = 0, observers = 0, canvasCount = 0;
    const effects = [], frames = new Map(), renders = [];
    let renderer;
    const container = {
        appendChild() { canvasCount++; },
        getBoundingClientRect() { return { width: 800, height: 600 }; }
    };
    const react = {
        createElement() {}, useRef: () => ({ current: container }),
        useState: () => [state, value => { if (state !== value) { state = value; dirty = true; } }],
        useEffect(fn, deps) {
            const slot = index++;
            const old = effects[slot];
            if (!old || deps.some((dep, i) => dep !== old.deps[i])) {
                old?.cleanup?.();
                effects[slot] = { deps, pending: fn };
            }
        }
    };
    const ogl = {
        Renderer: class {
            constructor(options) {
                allocations++; renderer = this; this.dpr = options.dpr;
                this.gl = { canvas: { style: {}, remove() { canvasCount--; } },
                    getExtension: () => ({ loseContext() { lost++; } }) };
            }
            setSize(w, h) { this.gl.drawingBufferWidth = w * this.dpr; this.gl.drawingBufferHeight = h * this.dpr; }
            render() { renders.push(now); }
        },
        Triangle: class { remove() { removals++; } },
        Program: class { constructor(gl, options) { this.uniforms = options.uniforms; } remove() { removals++; } },
        Mesh: class {}
    };
    const context = { exports: {}, require: name => name === 'react' ? react : ogl,
        window, document, navigator: { connection }, performance: { now: () => now },
        requestAnimationFrame(fn) { frames.set(++id, fn); return id; },
        cancelAnimationFrame(id) { frames.delete(id); },
        ResizeObserver: class { observe() { observers++; } disconnect() { observers--; } }
    };
    vm.runInNewContext(source, context);
    function flush() {
        do {
            dirty = false; index = 0; context.exports.default({});
            for (const effect of effects) if (effect.pending) {
                const fn = effect.pending; delete effect.pending; effect.cleanup = fn();
            }
        } while (dirty);
    }
    function tick(t) {
        now = t;
        const pending = [...frames.values()]; frames.clear();
        for (const fn of pending) fn(t);
        assert.ok(frames.size <= 1, 'only one RAF chain');
    }
    flush();
    if (reduced || saveData) {
        assert.equal(allocations, 0); assert.equal(frames.size, 0);
        motion.matches = false; connection.saveData = false;
        motion.emit('change'); connection.emit('change'); flush();
    }
    assert.equal(allocations, 1);
    assert.equal(renderer.dpr, mobile ? 1.5 : 2);
    if (hidden) assert.equal(frames.size, 0);
    document.hidden = false; document.emit('visibilitychange');
    for (const hz of [60, 120, 144]) {
        document.hidden = true; document.emit('visibilitychange');
        document.hidden = false; document.emit('visibilitychange');
        const before = renders.length, start = now + 100;
        for (let i = 0; i < hz * 2; i++) tick(start + i * 1000 / hz);
        assert.ok(Math.abs(renders.length - before - (mobile ? 60 : 120)) <= 1,
            `${hz}Hz rendered count: ${renders.length - before}`);
    }
    device.matches = !mobile; device.emit('change');
    assert.equal(renderer.dpr, mobile ? 2 : 1.5);
    const changedBefore = renders.length, changedStart = now + 100;
    for (let i = 0; i < 240; i++) tick(changedStart + i * 1000 / 120);
    assert.ok(Math.abs(renders.length - changedBefore - (mobile ? 120 : 60)) <= 1,
        'live device classification updates rendered cadence');
    window.devicePixelRatio = 1; resolution.emit('change');
    assert.equal(renderer.dpr, 1);
    window.emit('resize');
    document.hidden = true; document.emit('visibilitychange');
    assert.equal(frames.size, 0);
    const before = renders.length; tick(now + 10000); assert.equal(renders.length, before);
    document.hidden = false; document.emit('visibilitychange'); document.emit('visibilitychange');
    assert.equal(frames.size, 1);
    for (const preference of [motion, connection]) {
        const key = preference === motion ? 'matches' : 'saveData';
        preference[key] = true; preference.emit('change'); flush();
        assert.equal(frames.size, 0); assert.equal(canvasCount, 0); assert.equal(observers, 0);
        preference[key] = false; preference.emit('change'); flush();
        assert.equal(frames.size, 1); assert.equal(canvasCount, 1);
    }
    for (const effect of effects) effect.cleanup?.();
    assert.equal(frames.size, 0); assert.equal(observers, 0); assert.equal(canvasCount, 0);
    assert.equal(removals, allocations * 2); assert.equal(lost, allocations);
    assert.equal(targets.reduce((sum, value) => sum + value.count(), 0), 0);
}

check();
check({ mobile: true });
check({ reduced: true });
check({ saveData: true });
check({ hidden: true });
console.log('Grainient production effects: cadence, preferences, visibility, DPR and cleanup passed.');
