---
name: project_rei
description: Rei — AI VTuber + Solana token launcher project, forked from Project AIRI (moeru-ai)
type: project
---

## Rei (~/companion/)

AI VTuber companion that livestreams and launches tokens on Solana.

**Why:** Rohan wants an autonomous AI virtual character that streams across Twitch/YouTube/pump.fun, interacts with chat, and deploys meme tokens on Solana launchpads.

**How to apply:** This is a major project. Vue + Electron + Vite monorepo (forked from moeru-ai/airi). When working in ~/companion/, follow AGENTS.md conventions (UnoCSS not Tailwind, Eventa for IPC, injeca for DI, Valibot for schemas).

### Key Facts
- **Repo:** github.com/bludragon66613-sys/companion
- **Stack:** Vue 3, Vite, Electron, Turborepo, pnpm, UnoCSS, Three.js, Live2D
- **Package namespace:** `@proj-airi` (DO NOT rename — breaks monorepo)
- **Character name:** Rei (rebranded from AIRI → UwU → Ray → Rei on 2026-03-25)
- **Personality:** Crypto-savvy VTuber, cyberpunk aesthetic, streams + launches tokens
- **Personality file:** services/telegram-bot/src/prompts/personality-rei.velin.md
- **Web build:** Vercel (apps/stage-web)
- **Desktop:** Electron (apps/stage-tamagotchi)
- **Mobile:** Capacitor (apps/stage-pocket)

### What's Done (Phase 1 - Rebrand)
- Character name → Rei across all 9 locales
- UI/project name → Rei (index.html, settings, card defaults)
- New personality config written (personality-rei.velin.md)
- Build verified: packages (24/24) + web app both pass

### What's Done (Phase 2 - Solana + Streaming, 2026-03-26)
- **solana-launcher service** (services/solana-launcher/): wallet, autonomy engine (guardrails), pump.fun platform skeleton, launchpad selector, position tracker, token generator, server-sdk adapter — 42 tests passing
- **multistream service** (services/multistream/): RTMP relay (ffmpeg per platform), chat aggregator, Twitch/YouTube/Kick/pump.fun platform modules, server-sdk adapter — 8 tests passing
- Spec: docs/superpowers/specs/2026-03-25-rei-phase2-solana-streaming-design.md
- Plan: docs/superpowers/plans/2026-03-25-rei-phase2-solana-streaming.md
- @solana/web3.js v2 (async CryptoKeyPair API, not v1 Keypair)
- All 50 tests green, 24/24 package builds pass

### What's Next (Phase 3)
- Integrate actual pump.fun SDK (launch() is a TODO stub)
- Dashboard pages in stage-web (Vue): /solana, /stream
- Add shared event types to packages/server-shared
- Connect brain/consciousness module to launch triggers
- Devnet testing before mainnet
- OBS/ffmpeg streaming pipeline E2E test
