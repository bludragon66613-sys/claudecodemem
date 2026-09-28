---
name: project_edithinmotion
description: Edithinmotion studio websites (edithinmotion.com on Netlify + 4 Vercel sites), account split, deploy steps, and the 2026-09-28 live-site audit findings with prioritized fix list
type: project
---

# Edithinmotion websites

Edithinmotion is Lito's (Amol Sultania) two-person Hyderabad studio with Rohit Vardhan: brand, websites, apps and AI automation for clients. Source: handover dated 29 Sep 2026.

## Accounts (keep separate)
- Everything belongs to the **edithinmotion@gmail.com** side. Separate from Pawan Trading (patrac101@gmail.com). Never route Edithinmotion or DBA business through the Pawan Trading Telegram bot.
- The site repo `edithinmotion/edithinmotion-site` is under the edithinmotion GitHub account. Sessions on bludragon66613-sys cannot reach it until the Claude GitHub App is installed there or that account is connected. Give access by invitation (collaborator / Netlify team member / Vercel team member), never by sharing passwords.

## Sites
| Folder | Live | Deploy |
|---|---|---|
| `edithinmotion-v2` (main) | https://edithinmotion.com | Netlify, auto-deploys on push to `main` of `edithinmotion/edithinmotion-site` (`netlify.toml`). Moved from Vercel on 25 Sep 2026 |
| `edithinmotion-atlas` | https://edithinmotion-atlas.vercel.app | `vercel --prod --yes`; also mirrored as Claude Artifact 7BmqZ8CW8BWUQcv9uSid3b, update both |
| `edithinmotion-audit` | https://edithinmotion-audit.vercel.app | `vercel --prod` (git local only) |
| `edithinmotion-preview` | https://edithinmotion-preview.vercel.app | `vercel --prod` (no git) |
| `portfolio` | Vercel project `portfolio` | early Next.js, uncommitted edits |

Vercel team `jarvis-32968f41`, account `edithinmotion-4844`. Main site: Next.js serving a static export via a route handler; its `AGENTS.md` says read `node_modules/next/dist/docs/` before changing code.

Not in the handover package: `~/personal-bot/` (outreach bot with live Gmail creds), client projects (DBA Courtside has its own handover).

## Audit 2026-09-28 (live site only, no repo access)
Scores: Lighthouse perf **28 mobile / 56 desktop**; a11y 95; design critique **5/10**.

Confirmed issues, in fix order:
1. Hero is a scroll-scrubbed astronaut film that looks like Hollywood footage: licensing risk, says nothing about the studio. Replace with own work reel + concrete value line + "Start a project".
2. Mobile LCP 9.2 s, TBT 2 s: single 1.36 MB (356 KB brotli) bundle incl. Three.js, scripts without `defer`. Defer, lazy-load 3D, split routes.
3. Subpages not indexable: every path returns the same boot shell, inline JS rewrites to `/#/path`, canonical always homepage. Pre-render per route.
4. Homepage nav `visibility:hidden` and unreachable by keyboard; no persistent CTA on homepage.
5. `cache-control: max-age=0` on hashed assets; mismatched `?v=release14/19/20`. Soft 404s (unknown paths return 200). No security headers except HSTS.
6. Case studies lack problem/approach/outcome and numbers; DBA leads with login screen; Metapac/Research Lab placeholders; Mana Wizards links to a test deploy.
7. No testimonials, logos or founder photos. 9 services, inconsistent categories across pages.
8. Quick wins: remove Netlify badge (covers content) and Space ink toggle; kill scramble-text (stuck glyphs like "MARH KSZMRTJ"); fix "LET'S MAKEA MOVE" typo and clipped arrow; menu "Start a conversation" goes to /work; 12 px min text; 44 px tap targets; 61 contrast failures; lazy-load 0.8 to 1.8 MB scroll video.

Keep: reduced-motion handling and Pause Motion control, 3-required-field contact form with ₹ budget bands, CLS ~0, no console errors.

## Agents and skills for this site
`web-performance-engineer`, `technical-seo`, `accessibility-auditor`, `conversion-copywriter` (new 2026-09-28), plus `ui-ux-architect` (audit), `super-designer` (build, under `design-mastery`). Skills: `threejs-webgl`, `gsap-scroll-motion`, `visual-regression` (new), `motion-and-animation`, `accessible-primitives`.

## Code structure (from code zip, 2026-09-28)
- The live site is `public/index.html` + `public/runtime/app.js`, a prebuilt 1.36 MB esbuild bundle (React + Three.js) made outside this repo. **Its source is not in the repo.** `components/` is the old, unused Next.js site; `public/runtime/baseline.js` is an unused older bundle.
- Hand-written, editable layers: `public/runtime/upgrade.js` (opening film, 3D spellbook, Space ink), `polish.js` (page transitions), `upgrade.css`. Server: `app/route.ts` + `app/[...slug]/route.ts` serve index.html through Next on Netlify.
- Patch `edith-fixes.patch` delivered 2026-09-28: per-route title/description/canonical/OG via `lib/site-routes.ts`, real 404s, `defer` on scripts (mobile TBT −19%, load event 8.8 s → 3.8 s, LCP unchanged ~4.8 s local throttled), homepage header keyboard-reachable during the opening film, cache + security headers in `netlify.toml`, fake sitemap lastmod removed. Applied by Lito with `git apply`.
- Bundle splitting, lazy 3D, scramble text, copy fixes inside app.js need the bundle's original source.

## Open questions
- Where is the source code for `public/runtime/app.js`? (Possibly in a desktop-files zip or another folder on Lito's Mac.)
- Lito's preferred animation libraries: noted in the handover's `claude-memory/` folder, not yet received. Ask before choosing GSAP vs Framer Motion defaults.
- Is the hero footage licensed?
- Real client outcomes and testimonials for DBA, Area 77, Oktas.

## New site preview (edith-next), built 2026-09-28
- Fresh Next.js 16 static-export build (source zip `edith-next-source.zip`, not yet in any repo). Dark space story theme chosen by Rohan after rejecting a light minimal version ("too plain").
- Homepage: particle Earth (real continents from world-atlas land dots) + the old site's `orbital-relay.glb` satellite with orbit trail and downlink beam; particles morph into the brain (Brand), an exploded web page (Websites), the antenna (Content), then fuse into an interactive neural core (AI: drag, cursor push, click shockwave). Globe turns to Hyderabad, Almaty and USA with HTML labels (city, country, clients). Mana Wizards reveal film, animated particle-initial portraits for the founders.
- Pages: guided 7-step contact brief (WhatsApp/email hand-off, Netlify form stub), Studio media wall of all 22 images and films with lightbox, Services "mission control" console with canvas particle viewport and mission builder (links to /contact?services=).
- 3D starts only on the first interaction; a still image of the globe is the poster. Mobile Lighthouse about 78 to 84 locally, CLS about 0, a11y 100.
- Rohan's taste on this project: wants bold, cinematic, sci-fi motion, but "not overwhelming, simple, straightforward"; everything centred with nothing spilling out.
- Still placeholders: results/testimonials, booking link, budget bands, reply time, founder photos (portraits are generative for now).
