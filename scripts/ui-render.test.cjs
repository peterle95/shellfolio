/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS regression, matching scripts/*.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const React = require('react');
const { renderToString } = require('react-dom/server');
const ts = require('typescript');

const root = path.resolve(__dirname, '../src');
const cache = new Map();
let icons;
function loadSource(base) {
    const file = [base, `${base}.ts`, `${base}.tsx`].find(file => fs.existsSync(file));
    assert.ok(file, `Cannot resolve ${base}`);
    if (cache.has(file)) return cache.get(file).exports;
    const compiled = { exports: {} };
    cache.set(file, compiled);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
        module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const requireSource = name => {
        if (name === 'lucide-react') return icons;
        if (name.startsWith('@/')) return loadSource(path.join(root, name.slice(2)));
        if (name.startsWith('.')) return loadSource(path.resolve(path.dirname(file), name));
        return require(name);
    };
    vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(requireSource, compiled, compiled.exports);
    return compiled.exports;
}

test('sidebar skeleton markup is stable across server renders', async () => {
    icons = await import('lucide-react');
    const { SidebarMenuSkeleton } = loadSource(path.join(root, 'components/ui/sidebar'));
    const tree = React.createElement(SidebarMenuSkeleton, { showIcon: true });
    const markup = renderToString(tree);
    assert.match(markup, /data-sidebar="menu-skeleton-text"/);
    for (let i = 0; i < 10; i++) assert.equal(renderToString(tree), markup);
});
