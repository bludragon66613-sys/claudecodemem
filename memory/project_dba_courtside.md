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
