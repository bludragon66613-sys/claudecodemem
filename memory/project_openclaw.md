---
name: project-openclaw
description: OpenClaw local AI gateway — config, auth, Telegram bot setup, startup procedure, token refresh
type: project
---

## OpenClaw — Local AI Gateway for Telegram Bot

OpenClaw runs locally and connects the Telegram bot (@kaneda6bot) to AI models.

| Service | Port | Start command |
|---------|------|---------------|
| OpenClaw gateway | :18789 | auto (Windows Scheduled Task / login item) |
| openclaw-proxy | :5557 | `./aeon` script or `node ~/aeon/dashboard/openclaw-proxy/index.js` |
| NERV dashboard | :5555 | `./aeon` from `~/aeon` |

**Quick health check:** `bash ~/openclaw-healthcheck.sh` (checks everything + auto-fixes)
**Manual check:** `openclaw status` then `openclaw models status`

## Current Auth State (as of 2026-03-25 evening)
- **Active model:** `openai-codex/gpt-5.4` (primary) + `openai-codex/gpt-5.4-mini` (fallback)
- **Auth:** `openai-codex:default` OAuth — expires ~March 31, 2026
- **Anthropic auth:** EXPIRED (token `sk-ant-oat01-...8OcWJAAA` returns 404). Keep in auth store for future refresh.
- **Memory search:** Disabled (no embedding provider configured)
- **Config:** `~/.openclaw/openclaw.json`
- **Auth profiles:** `~/.openclaw/agents/main/agent/auth-profiles.json`

## Known Conflict Sources (all resolved as of 2026-03-25)
1. **Claude Code telegram plugin** — DISABLED in `~/.claude/settings.json` (causes 409 if enabled with same bot token)
2. **GitHub Actions "Messages" workflow** — DISABLED (was actively polling Telegram, caused 409)
3. **Phantom auth profiles** — Removed `anthropic:openclaw` and `anthropic:default` from openclaw.json (only `anthropic:claude` exists in auth-profiles.json)

## Token Refresh — Restore Claude (requires Windows Terminal, not Claude Code)
The `sk-ant-oat01-` token expires periodically. To refresh:
```
1. Open Windows Terminal
2. Run: C:\Users\Rohan\refresh-openclaw-auth.bat
   - Step 1: claude setup-token → copy the sk-ant-oat01-... token
   - Step 2: openclaw models auth paste-token --provider anthropic → paste
3. openclaw models set anthropic/claude-sonnet-4-6
4. openclaw gateway restart
```

## Key config paths
- `~/.openclaw/openclaw.json` — model, fallbacks, Telegram token, gateway config
- `~/.openclaw/agents/main/agent/auth-profiles.json` — stored OAuth/API tokens
- `~/aeon/dashboard/openclaw-proxy/index.js` — proxy sidecar bridging dashboard → OpenClaw hooks API
- `~/openclaw-healthcheck.sh` — automated health check script

**Why:** OpenClaw is the bridge for the Telegram AI bot. When its auth breaks, the bot silently fails.
**How to apply:** If user reports Telegram bot not responding, run `bash ~/openclaw-healthcheck.sh` first.
