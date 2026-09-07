// Run: node scripts/badge-check.cjs
// Execute production hooks/frame callback, mocking only React and browser/renderer boundaries.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const THREE = require('three');

function target(extra = {}) {
    const listeners = new Map();
    return Object.assign({
        addEventListener(name, fn) {
            if (!listeners.has(name)) listeners.set(name, new Set());
            listeners.get(name).add(fn);
        },
        removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
        emit(name, event = {}) { for (const fn of [...(listeners.get(name) || [])]) fn(event); },
        count() { return [...listeners.values()].reduce((n, set) => n + set.size, 0); }
    }, extra);
}

function harness(file, extra, dependencies = {}) {
    let index = 0, dirty = false;
    const slots = [], effects = [];
    const react = {
        Component: class {},
        createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
        useState(initial) {
            const i = index++;
            if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
            return [slots[i], value => {
                if (value !== slots[i]) { slots[i] = value; dirty = true; }
            }];
        },
        useRef(initial) { const i = index++; return slots[i] ||= { current: initial }; },
        useCallback(fn, deps) {
            const i = index++;
            if (!slots[i] || deps.some((v, n) => v !== slots[i].deps[n])) slots[i] = { fn, deps };
            return slots[i].fn;
        },
        useEffect(fn, deps) {
            const i = index++;
            if (!effects[i] || deps.some((v, n) => v !== effects[i].deps[n])) {
                effects[i]?.cleanup?.(); effects[i] = { deps, pending: fn };
            }
        }
    };
    const source = fs.readFileSync(path.join(__dirname, '../src/components/shellfolio/', file), 'utf8');
    const context = { exports: {}, React: react, ...extra, require: name => {
        if (name === 'react') return react;
        if (name in dependencies) return dependencies[name];
        throw new Error(`Unexpected dependency: ${name}`);
    } };
    vm.runInNewContext(ts.transpileModule(source + '\nexport { ' +
        (file === 'VisualEffects.tsx' ? 'useBadgeEnhancement' : 'Band, ResponsiveBand') + ' };', {
        compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true }
    }).outputText, context);
    return {
        render(name, props) {
            let result;
            do {
                dirty = false; index = 0; result = context.exports[name](props);
                for (const effect of effects) if (effect?.pending) {
                    const fn = effect.pending; delete effect.pending; effect.cleanup = fn();
                }
            } while (dirty);
            return result;
        },
        cleanup() { for (const effect of effects) effect?.cleanup?.(); }
    };
}

for (const idleAPI of [true, false]) {
    const desktop = target({ matches: true }), motion = target({ matches: false });
    const connection = target({ saveData: false });
    const document = target({ hidden: false, readyState: 'loading' });
    let id = 0;
    const pending = new Map();
    const schedule = fn => { pending.set(++id, fn); return id; };
    const cancel = id => pending.delete(id);
    const window = target({ matchMedia: q => q.includes('min-width') ? desktop : motion,
        setTimeout: schedule, clearTimeout: cancel,
        ...(idleAPI ? { requestIdleCallback: schedule, cancelIdleCallback: cancel } : {}) });
    const h = harness('VisualEffects.tsx', { window, document, navigator: { connection } }, {
        'next/dynamic': () => 'dynamic'
    });
    const render = (show = true) => h.render('useBadgeEnhancement', show);
    const tick = () => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn()); };
    assert.equal(render(), false); assert.equal(pending.size, 0, 'wait for load');
    document.readyState = 'complete'; window.emit('load');
    assert.equal(render(), false); assert.equal(pending.size, 1, 'wait for idle');
    document.hidden = true; document.emit('visibilitychange');
    assert.equal(pending.size, 0, 'cancel hidden import');
    tick(); assert.equal(render(), false);
    document.hidden = false; document.emit('visibilitychange'); tick();
    assert.equal(render(), true);
    for (const [object, key, blocked] of [[desktop, 'matches', false], [motion, 'matches', true], [connection, 'saveData', true]]) {
        object[key] = blocked; object.emit('change');
        assert.equal(render(), false); assert.equal(pending.size, 0);
        object[key] = !blocked; object.emit('change');
        assert.equal(render(), false); tick(); assert.equal(render(), true);
    }
    assert.equal(render(false), false, 'legal route excluded');
    assert.equal(pending.size, 0);
    h.cleanup();
    for (const object of [desktop, motion, connection, window, document]) assert.equal(object.count(), 0);
}

let frame, invalidations = 0, geometryUpdates = 0, ready = 0, failures = 0;
const canvas = target(), window = target(), document = { body: target({ style: { cursor: 'text' } }) };
const state = { size: { width: 1440, height: 900 }, viewport: { width: 9 },
    invalidate: () => invalidations++, gl: { domElement: canvas }, clock: { start() {} },
    pointer: new THREE.Vector2(), camera: new THREE.PerspectiveCamera() };
state.camera.position.z = 13;
const texture = () => new THREE.Texture(); texture.preload = () => {};
const gltf = () => ({ nodes: { card: {}, clip: {}, clamp: {} }, materials: {} }); gltf.preload = () => {};
const createBandHarness = () => harness('Badge.tsx', { window, document }, {
    three: THREE,
    '@react-three/fiber': { extend() {}, useThree: fn => fn ? fn(state) : state, useFrame: fn => { frame = fn; } },
    '@react-three/rapier': { RigidBody: 'body', useRopeJoint() {}, useSphericalJoint() {} },
    '@react-three/drei': { useTexture: texture, useGLTF: gltf },
    meshline: {}
});
const h = createBandHarness();
const props = { visible: true, setInteractive() {}, onReady: () => ready++, onFailure: () => failures++ };
const responsive = createBandHarness();
const firstBand = responsive.render('ResponsiveBand', props);
assert.equal(firstBand.props.key, state.viewport.width);
assert.equal(responsive.render('ResponsiveBand', { ...props, visible: false }).props.key, firstBand.props.key,
    'visibility does not remount bodies');
state.viewport.width = 10;
const resizedBand = responsive.render('ResponsiveBand', props);
assert.notEqual(resizedBand.props.key, firstBand.props.key, 'width change remounts entire Band, including joint hooks');
assert.equal(resizedBand.type, firstBand.type);
responsive.cleanup();
let tree = h.render('Band', props);
function flatten(node) { return node && typeof node === 'object' ? [node, ...node.children.flatMap(flatten)] : []; }
let nodes = flatten(tree);
const bodies = [];
for (const node of nodes.filter(n => n.type === 'body')) {
    const body = { asleep: false, lerped: new THREE.Vector3(),
        wakeUp() { this.asleep = false; }, isSleeping() { return this.asleep; },
        translation: () => ({ x: 1, y: 1, z: 0 }), angvel: () => ({ x: 0, y: 0, z: 0 }),
        rotation: () => ({ x: 0, y: 0, z: 0, w: 1 }), setAngvel() {}, setNextKinematicTranslation() {} };
    node.props.ref.current = body; bodies.push(body);
}
nodes.find(n => n.type === 'mesh' && n.props.ref).props.ref.current = { geometry: { setPoints() { geometryUpdates++; } } };
frame(state, 1 / 60); assert.equal(geometryUpdates, 1);
bodies.forEach(b => { b.asleep = true; });
frame(state, 1 / 60); assert.equal(geometryUpdates, 2, 'final resting strap snap');
frame(state, 1 / 60); assert.equal(geometryUpdates, 2, 'sleep skips geometry');
const mesh = nodes.find(n => n.props.onAfterRender);
assert.equal(ready, 0); mesh.props.onAfterRender(); mesh.props.onAfterRender(); assert.equal(ready, 1);
let captured = false;
const pointer = { setPointerCapture() { captured = true; }, hasPointerCapture: () => captured,
    releasePointerCapture() { captured = false; } };
nodes.find(n => n.props.onPointerDown).props.onPointerDown({ target: pointer, pointerId: 1, point: new THREE.Vector3() });
assert.ok(bodies.slice(1).every(b => !b.asleep), 'drag wakes connected bodies');
h.render('Band', props);
const before = invalidations; frame(state, 1 / 60); assert.ok(invalidations > before, 'drag keeps demand alive');
for (const [source, event] of [[document.body, 'lostpointercapture'], [window, 'pointerup'], [window, 'pointercancel']]) {
    source.emit(event, { pointerId: 2 });
    tree = h.render('Band', props);
    assert.equal(captured, true, `${event} from another pointer does not release capture`);
    assert.equal(flatten(tree).filter(n => n.type === 'body').at(-1).props.type, 'kinematicPosition');
}
// Loss bubbles from the underlying capture owner through the shared source, not the canvas.
document.body.emit('lostpointercapture', { pointerId: 1 });
tree = h.render('Band', props); assert.equal(captured, false);
assert.equal(flatten(tree).filter(n => n.type === 'body').at(-1).props.type, 'dynamic', 'capture loss ends drag');
bodies.forEach(b => { b.asleep = true; });
frame(state, 1 / 60);
const settled = invalidations, settledGeometry = geometryUpdates;
frame(state, 1 / 60);
assert.equal(invalidations, settled, 'lost capture does not leave a drag frame loop');
assert.equal(geometryUpdates, settledGeometry);
nodes.find(n => n.props.onPointerDown).props.onPointerDown({ target: pointer, pointerId: 1, point: new THREE.Vector3() });
h.render('Band', props);
window.emit('pointercancel', { pointerId: 1 }); h.render('Band', props); assert.equal(captured, false);
assert.equal(document.body.style.cursor, 'text');
const after = invalidations; window.emit('pointerup'); assert.equal(invalidations, after, 'terminal click does not wake badge');
h.render('Band', { ...props, visible: false });
const hiddenUpdates = geometryUpdates; frame(state, 10); assert.equal(geometryUpdates, hiddenUpdates);
h.render('Band', props); assert.ok(invalidations > after, 'resume invalidates');
canvas.emit('webglcontextlost'); assert.equal(failures, 1);
// The old keyed Band must release capture/cursor on resize, before a fresh dynamic Band mounts.
nodes.find(n => n.props.onPointerDown).props.onPointerDown({ target: pointer, pointerId: 1, point: new THREE.Vector3() });
h.render('Band', props); assert.equal(captured, true);
h.cleanup(); assert.equal(window.count() + canvas.count() + document.body.count(), 0);
assert.equal(captured, false, 'remount cleanup releases the old capture owner');
assert.equal(document.body.style.cursor, 'text');
const remounted = createBandHarness();
const freshNodes = flatten(remounted.render('Band', props));
assert.equal(freshNodes.find(n => n.props.position?.[1] === 4).props.position[0], -state.viewport.width / 2 + 2.5);
assert.equal(freshNodes.filter(n => n.type === 'body').at(-1).props.type, 'dynamic', 'remount clears stale drag state');
assert.ok(freshNodes.filter(n => n.type === 'body').every(n => n.props.ref.current === null), 'remount uses fresh body refs');
remounted.cleanup(); assert.equal(window.count() + canvas.count() + document.body.count(), 0);
console.log('Badge production hooks: load/idle gates, preferences, cleanup, sleeping strap, pointer-filtered capture loss, resize remount, visibility and readiness passed.');
