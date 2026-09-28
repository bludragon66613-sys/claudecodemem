# Loading and lifecycle

## 1. Poster-first hero (Next.js / React)

```tsx
// Hero.tsx
'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

function canRun3D() {
  if (typeof window === 'undefined') return false
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } }
  if (nav.connection?.saveData) return false
  if (/(^|-)2g|3g/.test(nav.connection?.effectiveType ?? '')) return false
  if ((nav.deviceMemory ?? 8) < 4) return false
  const c = document.createElement('canvas')
  return !!(c.getContext('webgl2') || c.getContext('webgl'))
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const [mount, setMount] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canRun3D()) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // wait for idle so hydration and first paint win
        const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200))
        idle(() => setMount(true))
        io.disconnect()
      }
    }, { rootMargin: '200px' })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="hero">
      <img src="/hero-poster.avif" alt="" fetchPriority="high" width={1600} height={900}
           style={{ opacity: ready ? 0 : 1, transition: 'opacity 400ms' }} />
      {mount && <Scene onReady={() => setReady(true)} />}
    </div>
  )
}
```

Vanilla equivalent: `const { initScene } = await import('./scene.js')` inside the same observer callback.

## 2. Render-loop control

### R3F
```tsx
<Canvas dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: false, powerPreference: 'high-performance' }}>
```
- `frameloop="demand"`: renders only on `invalidate()` or prop changes. Use for static or interaction-only scenes.
- For continuously animated scenes keep `"always"` but pause when not visible:

```tsx
function PauseWhenHidden() {
  const { gl, setFrameloop } = useThree() as any
  useEffect(() => {
    const el = gl.domElement
    const io = new IntersectionObserver(([e]) => setFrameloop(e.isIntersecting ? 'always' : 'never'))
    io.observe(el)
    const vis = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', vis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [gl, setFrameloop])
  return null
}
```

### Vanilla
```js
let running = true
renderer.setAnimationLoop(running ? tick : null)
new IntersectionObserver(([e]) => renderer.setAnimationLoop(e.isIntersecting ? tick : null)).observe(renderer.domElement)
```

## 3. Disposal (route changes, unmounts)

```js
function disposeScene(scene, renderer) {
  scene.traverse((o) => {
    o.geometry?.dispose()
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    mats.filter(Boolean).forEach((m) => {
      Object.values(m).forEach((v) => v?.isTexture && v.dispose())
      m.dispose()
    })
  })
  renderer.renderLists.dispose()
  renderer.dispose()
  renderer.forceContextLoss() // only when the canvas is going away for good
}
```
Check for leaks: `renderer.info.memory` (geometries, textures) should return to baseline after navigating away and back.

## 4. Context loss

```js
canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); showPoster() })
canvas.addEventListener('webglcontextrestored', () => rebuildScene())
```

## 5. Accessibility

- Decorative background: `aria-hidden="true"` on the canvas; the poster has `alt=""`.
- Meaningful scene: `role="img" aria-label="Particles forming a brain, then a ring, then a grid"`.
- Interactive controls (shape switcher, drag to rotate): real `<button>`s with labels; arrow keys for rotation; visible focus.
- Reduced motion: no autoplaying loop. Show the poster or a single static frame; allow opt-in with a "Play animation" button.

## 6. Stray contexts

Libraries (feature detection, GPU tier checks) sometimes create a throwaway WebGL context and keep it. Call `getExtension('WEBGL_lose_context')?.loseContext()` on any detection canvas.
