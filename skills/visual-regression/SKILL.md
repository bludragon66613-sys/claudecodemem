---
name: visual-regression
description: Playwright screenshot baselines and visual diffs for websites, including motion-heavy and WebGL pages. Captures every route at mobile, tablet and desktop, freezes animations, masks canvases and video, waits for scroll reveals, then diffs against a baseline so design, performance, SEO or accessibility changes never silently break layouts. Use before and after any frontend change, and as a CI gate.
---

# Visual regression

A safety net for every other agent: capture how the site looks now, change things, prove nothing else moved.

## When to Use

- Before any refactor, performance fix, routing change or accessibility fix
- Reviewing a design change: produce a before/after gallery
- Setting up a CI check that fails on unexpected layout changes

## Core recipe

1. **Route list** in one file (`tests/visual/routes.ts`), shared by every test.
2. **Viewports**: 375×812, 768×1024, 1440×900 (add 1920×1080 for hero-heavy sites).
3. **Stabilise** before each shot:
   - `reducedMotion: 'reduce'` on the context (the site should show final states)
   - inject CSS to kill transitions and animations, hide carets
   - pause and mask `<video>` and `<canvas>` (they change every frame)
   - scroll slowly to the bottom and back so lazy images and scroll reveals complete
   - wait for `document.fonts.ready` and network idle
   - hide third-party overlays (hosting badges, chat widgets)
4. **Compare** with `expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.01 })`.
5. **Review** diffs in the HTML report (`npx playwright show-report`); update baselines only on intended changes (`--update-snapshots`).

## Rules

- Baselines are OS and font dependent. Generate them in the same environment that runs the comparison (the CI container or the same Docker image).
- Never update baselines to make a failing check pass without looking at the diff.
- In a GPU-less sandbox launch Chromium with `--use-gl=swiftshader --enable-unsafe-swiftshader`; still mask canvases.
- If the project pins its own Playwright version, do not run `playwright install` in sandboxes that ship Chromium; use `executablePath` (for example `/opt/pw-browsers/chromium`).

## References

Load: `references/playwright-baselines.md` for the full config, the stabilise helper, a live-site mode (no repo access) and a CI workflow
