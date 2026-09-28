# ScrollTrigger patterns

## Setup (Next.js App Router)

```tsx
// app/providers/SmoothScroll.tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return // native scroll
    const lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
  return <>{children}</>
}
```

Lenis note: keep native scrolling for keyboard (Space, PageDown, arrows) and find-in-page working. Test both after adding it.

## Component animations with cleanup

```tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export function Section() {
  const scope = useRef<HTMLElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.card', {
        y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true },
      })
    })
    // reduced motion: nothing to do, cards are visible by default
  }, { scope })
  return <section ref={scope}>…</section>
}
```

`gsap.from` leaves elements visible if JS never runs. Avoid CSS that sets `opacity:0` globally for "waiting" states.

## Pinning

```js
ScrollTrigger.create({ trigger: '.intro', start: 'top top', end: '+=100%', pin: true, scrub: true, animation: tl })
```
- Keep pinned length ≤ 100 to 150% of the viewport for intros.
- Pinning changes layout: call `ScrollTrigger.refresh()` after fonts and images load (`document.fonts.ready.then(() => ScrollTrigger.refresh())`).
- On mobile, `ScrollTrigger.normalizeScroll(true)` can fix address-bar jumps, but test carefully; it can fight Lenis.

## Scroll-scrubbed video

```js
const v = document.querySelector('video')
v.pause()
gsap.to(v, { currentTime: v.duration || 10, ease: 'none',
  scrollTrigger: { trigger: '.film', start: 'top top', end: '+=150%', scrub: 0.5, pin: true } })
```
- Encode with frequent keyframes for smooth seeking: `ffmpeg -i in.mp4 -g 1 -crf 28 -an -movflags +faststart out.mp4` (every frame a keyframe; larger file, so keep it short and small).
- Alternative for very smooth scrubbing: an image sequence drawn to canvas (`.webp` frames), lazy-loaded in batches.
- `preload="none"` until the section is near; separate mobile encode.
- Reduced motion: show a poster and a "Play" button instead.

## Route transitions (App Router)

- Kill or revert triggers on route change: `useGSAP` handles component-scoped ones. For global ones call `ScrollTrigger.getAll().forEach(t => t.kill())` in a layout effect keyed on pathname.
- Scroll to top on navigation after the exit animation finishes; reset Lenis (`lenis.scrollTo(0, { immediate: true })`).
- Keep exit animations short (≤ 300 ms) so navigation feels instant.

## Common bugs

| Symptom | Cause | Fix |
|---|---|---|
| Sections blank after fast scroll | reveal only fires on `onEnter` with `toggleActions` reversing | `once: true`; reveal anything already above viewport on load |
| Triggers fire at wrong positions | images or fonts loaded after setup | `ScrollTrigger.refresh()` after load |
| Double animations in dev | React Strict Mode double-mount without cleanup | `useGSAP` or return `ctx.revert()` |
| Jank on mobile | animating filters, box-shadow, width | transforms and opacity only; `will-change` sparingly |
| Header hidden and unreachable | `visibility:hidden` toggled by scroll direction | hide with transform; show on `:focus-within` |
