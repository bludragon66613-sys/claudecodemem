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

## Open questions
- Lito's preferred animation libraries: noted in the handover's `claude-memory/` folder, not yet received. Ask before choosing GSAP vs Framer Motion defaults.
- Is the hero footage licensed?
- Real client outcomes and testimonials for DBA, Area 77, Oktas.
