# Text reveals

## Split-line reveal (safe default)

```js
import { SplitText } from 'gsap/SplitText' // free since GSAP 3.13
gsap.registerPlugin(SplitText)

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const split = SplitText.create('.headline', { type: 'lines', mask: 'lines', aria: 'auto' })
  gsap.from(split.lines, { yPercent: 100, duration: 0.8, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.headline', start: 'top 85%', once: true } })
  return () => split.revert()
})
```

- `aria: 'auto'` keeps the original text readable to screen readers (split spans are hidden from the tree).
- Revert on resize or when fonts load (`autoSplit: true` with `onSplit`) so line breaks stay correct.

## Scramble text, done right

Scramble is the effect most likely to look broken: screenshots, slow devices and interrupted scrolls catch it mid-state ("MARH KSZMRTJ").

Rules:
- Duration ≤ 400 ms total. Run **once**.
- Start from the real text, scramble a few characters, resolve left to right. Never start from pure noise.
- Resolve immediately if the element is already in view on load or the user scrolls past quickly (`onLeave: () => tl.progress(1)`).
- Keep the real text in the DOM for assistive tech: put the animated text in an `aria-hidden` span and the real text in a visually hidden span, or use `aria-label` on the heading.
- Reduced motion: no scramble at all.

```js
gsap.to(el, { duration: 0.35, scrambleText: { text: el.dataset.text, chars: 'upperCase', revealDelay: 0.05, speed: 0.6 },
  scrollTrigger: { trigger: el, start: 'top 85%', once: true, onLeave: (self) => self.animation?.progress(1) } })
```

## Word or letter reveals on coloured backgrounds

The pre-reveal colour is what users see first. If words start at 20% opacity on a blue background, that state must still meet 3:1 (large text) or it reads as broken. Start at 40 to 60% opacity, or reveal with movement instead of opacity alone.

## Display type and tracking

Very tight tracking on condensed display faces makes letters collide at large sizes. Test the headline at every breakpoint; use `letter-spacing: -0.01em` as a floor for condensed caps and check that the last word never overflows the viewport.

## Checklist before shipping any text animation

- [ ] Text readable with JS disabled
- [ ] Readable in a screenshot taken at any moment
- [ ] Final state reached even after a fast scroll or anchor jump
- [ ] Screen reader reads the text once, correctly
- [ ] `prefers-reduced-motion: reduce` shows final text instantly
- [ ] No layout shift when the split is applied
