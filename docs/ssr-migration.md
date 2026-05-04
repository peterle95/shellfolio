# SSR Migration Notes

This document explains how to check whether the SSR migration improves production performance, what client-side rendering and server-side rendering mean in a Next.js app, and what changed in Shellfolio.

## How To Check Production Speed

Do not judge production performance from `npm run dev`. The dev server compiles routes on demand, so a slow first request like `GET / 200 in 39631ms` mostly measures local compilation time, not the user experience in production.

Use a production build instead:

```bash
npm ci
npm run build
npm run start
```

Then open `http://localhost:3000` unless you pass a custom port to `next start`.

The most useful checks are:

- Build output: `next build` prints whether `/` is static, server-rendered, or dynamic, plus the first-load JavaScript size.
- Lighthouse: run Chrome Lighthouse against `npm run start`, with cache disabled or in a fresh profile.
- Chrome DevTools Network tab: compare transferred JavaScript, number of chunks, HTML size, and when the first visible terminal content appears.
- Chrome DevTools Performance tab: compare scripting time, hydration work, Total Blocking Time, FCP, and LCP.
- Vercel Preview/Production: deploy both the old branch and the SSR branch, then compare Vercel Speed Insights or Lighthouse reports from the same region/device profile.

For this migration, the verified production build reports:

```text
Route (app)                                 Size  First Load JS
o /                                      9.72 kB         111 kB
o /_not-found                              977 B         102 kB

o  (Static)  prerendered as static content
```

The important part is the `o /` static marker from the build table. The homepage is now prerendered as static content, so the browser receives real HTML for the page shell instead of waiting for the whole page to render from client JavaScript.

To compare against the previous setup, run the same commands on the old branch and this branch:

```bash
git checkout master
npm ci
npm run build

git checkout ssr
npm ci
npm run build
```

Record these numbers for each branch:

- Route rendering mode for `/`
- First Load JS for `/`
- Largest individual chunks in `.next/static/chunks`
- Lighthouse FCP, LCP, TBT, and Performance score
- Network JavaScript transferred on first load

## Client-Side Rendering Vs Server-Side Rendering

Client-side rendering means the browser downloads JavaScript and React builds most of the UI in the browser. The initial HTML can be very small, but the user may wait for JavaScript parsing, execution, data loading, and hydration before the app becomes useful. This is fine for deeply interactive UI, but expensive when static content is included in the client bundle.

Server-side rendering means HTML is produced before it reaches the browser. In the Next.js App Router, Server Components go further: components that do not need browser APIs, state, or event handlers can render on the server and do not ship their component JavaScript to the browser.

Static prerendering is the best case for this portfolio. Because the first screen mostly uses static portfolio copy and a predictable layout, Next.js can generate the homepage at build time. The user gets HTML immediately, and only the interactive islands hydrate on the client.

## Why Next.js Fits This Project

Next.js is a good choice here because Shellfolio is a hybrid experience:

- The portfolio content and terminal frame are mostly static and benefit from server rendering.
- The prompt, command history, autocomplete, and WebGL visuals need browser interactivity.
- The App Router lets those two worlds coexist: Server Components by default, with `"use client"` only where browser state or effects are needed.
- Static optimization lets the homepage become prebuilt HTML when no request-time data is required.
- `next/dynamic` lets heavy visual effects load separately from the initial server-rendered page.

That combination is exactly what this project needs: fast first paint for a portfolio, while preserving the interactive terminal and 3D/WebGL interactions.

## Previous Project Setup

Before the migration, `src/app/page.tsx` started with `"use client"`. That made the entire homepage a Client Component, including layout markup that did not need browser APIs.

The page also imported the terminal and visual effects directly:

- `Terminal`
- `Grainient`
- `Badge`
- an unused `next/image` import

Because the page was client-side, static shell markup, welcome text, terminal chrome, and heavy visual dependencies all entered the client-side module graph.

The terminal was also fully client-bound:

- `src/components/shellfolio/terminal.tsx` was marked `"use client"`.
- `TerminalShellFrame` used `useTerminal`, so even the static window chrome had to be client-side.
- `TerminalViewport` used the Radix `ScrollArea` client primitive even though native scrolling was enough for the terminal.
- The welcome screen and quick actions were rendered inside the same client component as command history and prompt input.

There were also unused client-side paths:

- `src/app/badge/*` contained a standalone React `createRoot` app inside the Next `app` directory.
- `src/components/shellfolio/commands.ts` was legacy code and created unnecessary coupling with `outputs.tsx`.
- `Toaster` was mounted globally, but no app code called `toast`.

Finally, production verification was blocked because installed dependencies did not match `package.json` and the lockfile was out of sync.

## SSR Migration Changes

The homepage is now a Server Component again. `src/app/page.tsx` no longer has `"use client"`, and it renders the static page layout and fallback background on the server.

The visual effects were moved behind a small client island:

- `src/components/shellfolio/VisualEffects.tsx` is the only wrapper that loads the WebGL visuals.
- `Grainient` and `Badge` are loaded with `next/dynamic` and `ssr: false`.
- The static CSS fallback background is present immediately in server-rendered HTML.
- The badge only mounts on large screens, avoiding unnecessary 3D work on smaller devices.

The terminal was split into static and interactive parts:

- `TerminalShellFrame` is now server-renderable static chrome.
- `TerminalWelcome` stays server-renderable.
- `TerminalInteractiveViewport`, `TerminalPromptLine`, `QuickActions`, and `TerminalResetButton` remain client-side because they need state, effects, event handlers, or browser storage.
- `TerminalViewport` now uses native scrolling instead of Radix `ScrollArea` on the terminal path.

Unused client-side code was removed or isolated:

- `src/app/badge/*` was deleted.
- `src/components/shellfolio/commands.ts` was deleted.
- `Toaster` was removed from the root layout because no toast calls exist.

The dependency setup was repaired:

- `npm install` updated `package-lock.json`.
- `npm ci` now completes successfully from a clean install.
- `npm run typecheck` passes.
- `npm run build` passes and confirms `/` is statically prerendered.

## Why This Is Faster And Cleaner

The browser now receives useful HTML for the homepage immediately. It does not need to execute the entire page component tree before showing the terminal frame and welcome content.

The client bundle is more focused. Only the pieces that genuinely need client behavior hydrate in the browser: terminal input/history controls and visual effects.

Heavy browser-only graphics are no longer part of the server-rendered page shell. They load as progressive enhancements after the initial HTML and fallback background are already available.

The component logic is also clearer:

- Server components own static structure and content.
- Client components own browser state, effects, storage, event handlers, and WebGL.
- Legacy or unused client entry points are gone.

That is the main SSR win for this app: not making everything server-rendered, but putting each part of the experience on the side where it belongs.

## Why Removing `"use client"` Works Now

Removing `"use client"` from `src/app/page.tsx` by itself broke the app because the old page was doing client-only work directly in the route component. The page was not just static layout; it also imported browser-heavy visual components and contained a `style jsx` block. Once the route becomes a Server Component, code in that file must be safe to render on the server.

The current version works because the server/client boundary was moved before removing `"use client"`:

- `src/app/page.tsx` now only renders server-safe layout, the static fallback background, and component boundaries.
- Browser-only visual rendering lives in `VisualEffects`, which is explicitly a Client Component.
- `Grainient` and `Badge` are loaded with `next/dynamic` inside that client wrapper, so WebGL, Three.js, `window`, `document`, canvas setup, and viewport checks stay in the browser.
- The old `style jsx` block was removed from the route. Styling that belongs to the page fallback now lives in `globals.css`, which is safe for server-rendered routes.
- The terminal wrapper is no longer entirely client-side. Static chrome and welcome content can render from the server, while prompt input, history, quick actions, reset behavior, and scrolling remain in small client components.

So the fix was not simply "delete the directive." The fix was to make `page.tsx` server-safe first, then keep `"use client"` only on the files that actually need browser APIs, React state, effects, or event handlers.
