---
name: project-openclaw
description: OpenClaw local AI gateway — config, auth, Telegram bot setup, startup procedure, token refresh
type: project
---

## OpenClaw — Local AI Gateway for Telegram Bot

OpenClaw runs locally and connects the Telegram bot to AI models. Three services must be running:

| Service | Port | Start command |
|---------|------|---------------|
| OpenClaw gateway | :18789 | auto (Windows Scheduled Task / login item) |
| openclaw-proxy | :5557 | `./aeon` script or `node ~/aeon/dashboard/openclaw-proxy/index.js` |
| NERV dashboard | :5555 | `./aeon` from `~/aeon` |

**Check all at once:** `openclaw status`

## Current Auth State (as of 2026-03-25)
- **Active model:** `openai-codex/gpt-5.4` (primary) + `openai-codex/gpt-5.4-mini` (fallback)
- **Auth:** `openai-codex:default` OAuth — expires ~April 5, 2026
- **Anthropic auth:** EXPIRED (`sk-ant-oat01-...` token invalid — needs refresh)
- **Config:** `~/.openclaw/openclaw.json`
- **Auth profiles:** `~/.openclaw/agents/main/agent/auth-profiles.json`

## Startup Check (run at session start if bot issues reported)
```bash
openclaw status          # gateway + channels health
openclaw models status   # check auth expiry
```
If Telegram shows anything other than `OK`, or auth shows expired → see Token Refresh below.

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
The batch file is at `C:\Users\Rohan\refresh-openclaw-auth.bat`.

## Why auth breaks
`sk-ant-oat01-` tokens are Claude.ai OAuth tokens. They expire/revoke when:
- A new one is generated (previous one invalidated)
- Claude Pro session expires
- Account changes

`openai-codex` OAuth token (GitHub Copilot) is more stable — use as fallback.

## Key config paths
- `~/.openclaw/openclaw.json` — model, fallbacks, Telegram token, gateway config
- `~/.openclaw/agents/main/agent/auth-profiles.json` — stored OAuth/API tokens
- `~/aeon/dashboard/openclaw-proxy/index.js` — proxy sidecar bridging dashboard → OpenClaw hooks API

**Why:** OpenClaw is the bridge for the Telegram AI bot. When its auth breaks, the bot silently fails.
**How to apply:** If user reports Telegram bot not responding, check `openclaw status` and `openclaw models status` first.
