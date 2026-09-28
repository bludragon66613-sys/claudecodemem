---
name: threejs-webgl
description: Production Three.js / React Three Fiber patterns for marketing heroes, particle systems and interactive 3D on websites. Covers lazy-loading the scene off the critical path, poster-first LCP, render-loop control (frameloop demand, pause off-screen), DPR caps, GPU resource disposal, low-power and reduced-motion fallbacks, and particle/shader performance. Use when building, auditing or optimizing any WebGL canvas on a web page.
---

# Three.js and WebGL for the web

Patterns for 3D that looks premium and still loads fast on a mid-range phone. Applies to vanilla Three.js and React Three Fiber (R3F) with drei.

## When to Use

- Adding a WebGL hero, particle field, 3D product/object viewer or shader background
- A Lighthouse report blames Three.js for bundle size, long tasks or bootup time
- Scenes stutter, drain battery, leak memory across route changes, or lose context
- Auditing 3D for accessibility and reduced motion

## Non-negotiables

1. **Poster first.** The LCP element is a static image of the scene's first frame, never the canvas.
2. **Scene code is lazy.** `import('three')` / `next/dynamic(() => import('./Scene'), { ssr: false })` after first paint or when the canvas nears the viewport.
3. **Render only when needed.** Pause when off-screen or the tab is hidden; `frameloop="demand"` for static scenes.
4. **Cap DPR.** `dpr={[1, 1.5]}` on R3F; `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`.
5. **Dispose on unmount.** Geometries, materials, textures, render targets. R3F disposes what it created; you dispose what you created manually.
6. **Fallbacks.** Reduced motion, low-power devices, `Save-Data`, and WebGL unavailable all get the poster (optionally with a CSS animation).
7. **Accessible.** The canvas has `role="img"` and an `aria-label`, or a visually hidden description; interactive scenes have keyboard equivalents.
8. **One canvas.** Multiple WebGL contexts per page multiply memory; share one renderer or use drei `<View>`.

## Quick budget

| Item | Mobile budget |
|---|---|
| Three.js + scene JS (compressed) | Loaded after first paint; under 200 KB compressed for the scene chunk |
| Draw calls | < 100 |
| Particles (Points) | 20k to 50k mobile, 100k to 200k desktop, GPU-animated |
| Textures | KTX2/Basis compressed, ≤ 2048 px, power of two |
| Models | glTF + Draco or Meshopt, < 1 MB |
| Frame time | < 16 ms at DPR 1.5 |

## References

Load: `references/loading-and-lifecycle.md` for the lazy-mount pattern, poster swap, visibility pausing, disposal, context loss, fallbacks
Load: `references/particles-and-performance.md` for GPU particle systems, shape morphing, shader tips, profiling
