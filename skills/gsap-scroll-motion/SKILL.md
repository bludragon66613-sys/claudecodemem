---
name: gsap-scroll-motion
description: GSAP + ScrollTrigger + Lenis patterns for scroll-driven storytelling on marketing and portfolio sites. Covers React cleanup with useGSAP, pinning and scrubbing, scroll-scrubbed video, text reveals that stay readable (no stuck scrambled glyphs), content-visible-by-default reveals, route transitions in Next.js App Router, reduced motion with gsap.matchMedia, and when scroll-jacking hurts. Use when building or auditing scroll animation.
---

# GSAP scroll motion

Scroll animation that feels cinematic without hiding content, breaking keyboard users, or janking on phones.

## When to Use

- Building a scroll-driven intro, pinned section, horizontal scroll or scrubbed video
- Adding text reveals (split lines, scramble, fade-up)
- Content "disappears" for fast scrollers, find-in-page or screenshots
- Animations leak or double-fire across route changes in React/Next.js

## Principles

1. **Content is visible by default.** Set the hidden start state from JS (`gsap.from`, or a class added by JS), so no-JS, crawlers and failed scripts still show text.
2. **Reveal once, and reveal anything already passed.** Use `once: true` and check `ScrollTrigger.isInViewport` / `start: 'top bottom'` so a fast scroll or anchor jump never leaves sections blank.
3. **Readable at every frame.** Scramble or split effects must finish in under 400 ms and never rest on a partial state. Screenshots mid-animation must still be legible.
4. **Scroll-jacking is a cost.** Pinned intros longer than about one viewport lose visitors. Always offer "Skip" and never gate navigation behind the intro.
5. **Honor reduced motion** with `gsap.matchMedia()`: no pins, no scrubs, no scramble; show final states.
6. **Clean up.** In React use `useGSAP()` (from `@gsap/react`) with a scope; it reverts on unmount.
7. **Transform and opacity only.** Never animate layout properties (top, height, width) on scroll.

## References

Load: `references/scrolltrigger-patterns.md` for setup with Lenis, useGSAP, pinning, scrubbed video, route transitions, refresh pitfalls
Load: `references/text-reveals.md` for split-text, scramble done right, reduced-motion variants, accessibility of animated text
