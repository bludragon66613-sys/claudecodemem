---
name: DBA Courtside (Dream Basketball Academy dashboard)
description: Live staff dashboard dba-courtside.vercel.app — taken over 2026-09-28 from another Claude account; Google Sheets sync in check-only mode, go-live pending
type: project
---

Handed over 2026-09-28 (package "DBA Courtside handover 2026-09-29", HANDOVER.md is the source of truth).

- Repo `edithinmotion/dba-courtside` (main = production). Vite + React 19, Vercel functions `api/`, Supabase.
- Vercel team `jarvis-32968f41`, project `dba-courtside`, NOT git-connected — deploy with `vercel deploy --prod` from local repo; main must match prod.
- Supabase project `xvvilhmjljdshrritygi` (Tokyo). Migrations 001–017 applied (via MCP/SQL editor, no CLI link).
- Commit author: `Amol Sultania <edithinmotion@gmail.com>`. Work on a branch, fast-forward main.
- Staff logins: hello@getdba.com, edithinmotion@gmail.com (admin).
- Sync: Apps Script in "DBA Courtside Sync" sheet (hello@getdba.com) → POST /api/sheet-sync. `SHEET_SYNC_ENABLED=false` = check-only.
- Tests: `node --test api/_lib/sheets/*.test.js api/_lib/sheet-sync.test.js src/lib/*.test.js apps-script/*.test.mjs`; build `npm run build`.

Resume order (HANDOVER §6): finish check-only testRuns (~34 deferred attendance tabs) → [key rotation DEFERRED by owner] → go live (SHEET_SYNC_ENABLED=true + deploy, ask first) → live testRuns until no "deferred" → `node scripts/sync/cleanup-apollo-dates.mjs` then `--apply` (owner APPROVED, ~169 wrong-dated Apollo subs; tell user before apply) → `installTrigger` → staff Sheet review (385/58/281) → ask Sujay to make Clients List Restricted.

Rules: never deploy, go live, or delete data without telling the user first. One click-action at a time for the user. Keep Edithinmotion/DBA content out of the Pawan Trading Jarvis bot (separate business). See [[feedback_dba_sujay_sheet_readonly]].

## Status 2026-09-29 (IST ~02:20) — PAUSED, owner: "go live tomorrow"
- Fixes on main + DEPLOYED to prod: `beeff61` (check-only dry runs count claims so they match live; attendance shares a day's record; plans rank same-sheet-row → nearest date; payments on the other-player path; no removal review for records another row still links; cleanup-apollo-dates.mjs now needs a twin + untouched + imported-only payments, `--apply --expect=N`, `--out=`; new restore-apollo-dates.mjs). 74 tests.
- Push path: owner pushes from Mac (edithinmotion) via git bundle — keep bludragon OFF that repo (pending collaborator invite should be deleted). Vercel CLI login is edithinmotion-4844 (needs `NODE_USE_ENV_PROXY=1` in cloud container).
- Full check-only pass DONE on all 61 tabs (CHECK_HASHES cleared first): only creates = Apollo Clients List 169 + kaira attendance 6 (Dec-25 22/23/26, Feb-26 5/6/12). 0 errors/conflicts/removals.
- NEXT: (1) decide key rotation (still deferred; recommended before live) → (2) ask OK, set SHEET_SYNC_ENABLED=true, redeploy → (3) testRun until nothing deferred (expect 175 created) → (4) cleanup report, show count, then `--apply --expect=N` (back up file to owner) → (5) installTrigger.
- Side note: "1117 feedback notes pending" toast on Overview looks wrong (counts every imported player) — cosmetic, look after go-live. dba-vercel-demo.vercel.app is a separate sample-data demo, not prod.

