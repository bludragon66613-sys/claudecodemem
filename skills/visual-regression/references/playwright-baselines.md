# Playwright baselines

## Config

```ts
// playwright.visual.config.ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screens__/{projectName}/{arg}{ext}',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    reducedMotion: 'reduce',
    launchOptions: { args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide' } },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: process.env.BASE_URL ? undefined : { command: 'npm run build && npm run start', port: 3000, reuseExistingServer: true },
})
```

## Stabilise helper

```ts
// tests/visual/stabilise.ts
import type { Page } from '@playwright/test'

export async function stabilise(page: Page) {
  await page.addStyleTag({ content: `
    *, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }
    /* third-party overlays: example selectors, inspect the site and adjust */
    [data-netlify-badge], #netlify-hud, .intercom-lightweight-app { display: none !important; }
  ` })
  await page.evaluate(async () => {
    document.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0 })
    await document.fonts.ready
    // slow scroll so IntersectionObserver reveals and lazy images fire
    const step = innerHeight / 2
    for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)) }
    scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')
}

export const dynamicMasks = (page: Page) => [page.locator('canvas'), page.locator('video')]
```

## Test

```ts
// tests/visual/routes.spec.ts
import { test, expect } from '@playwright/test'
import { routes } from './routes'
import { stabilise, dynamicMasks } from './stabilise'

for (const route of routes) {
  test(`visual ${route}`, async ({ page }) => {
    await page.goto(route)
    await stabilise(page)
    await expect(page).toHaveScreenshot(`${route.replace(/\//g, '_') || 'home'}.png`, {
      fullPage: true, mask: dynamicMasks(page),
    })
  })
}
```

Run: `npx playwright test -c playwright.visual.config.ts`. First run creates baselines.

## Live-site mode (no repo access)

When you can only reach the deployed site, set `BASE_URL=https://example.com` and keep baselines in a scratch folder. Use it to:
- capture a "before" set, deploy a change, capture "after", and diff
- produce a before/after gallery for the user (side by side PNGs)

Pixel diffs of a live site are noisy (content changes, A/B tests). Prefer per-section element screenshots (`locator.screenshot()`) for targeted checks.

## CI (GitHub Actions)

```yaml
name: visual
on: [pull_request]
jobs:
  visual:
    runs-on: ubuntu-latest
    container: mcr.microsoft.com/playwright:v1.50.0-jammy   # match the project's @playwright/test version
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test -c playwright.visual.config.ts
      - if: failure()
        uses: actions/upload-artifact@v4
        with: { name: visual-report, path: playwright-report }
```

Generate and commit baselines from the same container image (`docker run ... npx playwright test --update-snapshots`) so fonts match.

## Triage

| Diff | Likely cause |
|---|---|
| Whole page shifted a few px | font loaded late or fallback font; wait for `document.fonts.ready` |
| Random regions differ each run | un-masked animation, video, canvas, or a carousel |
| Only mobile differs | breakpoint change; check intentional |
| Text blank or faded | scroll reveal not triggered; slow the scroll step |
