#!/usr/bin/env node
/**
 * Away Summary Hook (inspired by CC's awaySummary.ts)
 *
 * Runs on SessionStart. If the user has been away >2h since the last session,
 * reads the most recent session savepoint and injects a "while you were away" recap.
 *
 * Logic:
 * 1. Check time since last session ended (via .last-session-end marker)
 * 2. If <2h, skip (still in active work mode)
 * 3. If >=2h, find most recent session savepoint and inject summary
 * 4. Update the marker timestamp
 */
const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = path.join(HOME, '.claude', 'projects', 'C--Users-Rohan', 'memory');
const MARKER_FILE = path.join(MEMORY_DIR, '.last-session-end');
const MIN_AWAY_HOURS = 2;

function findLatestSavepoint() {
  try {
    const files = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.startsWith('session_savepoint_') && f.endsWith('.md'))
      .sort()
      .reverse();
    return files.length > 0 ? files[0] : null;
  } catch {
    return null;
  }
}

function extractSummary(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract frontmatter description or first meaningful content
    const descLine = lines.find(l => l.startsWith('description:'));
    if (descLine) {
      return descLine.replace('description:', '').trim().replace(/^["']|["']$/g, '');
    }

    // Fallback: first non-empty, non-frontmatter line
    let inFrontmatter = false;
    for (const line of lines) {
      if (line.trim() === '---') {
        inFrontmatter = !inFrontmatter;
        continue;
      }
      if (!inFrontmatter && line.trim().length > 10) {
        return line.trim().slice(0, 200);
      }
    }
    return null;
  } catch {
    return null;
  }
}

function main() {
  try {
    // Check idle time
    let hoursSince = Infinity;
    try {
      const stat = fs.statSync(MARKER_FILE);
      hoursSince = (Date.now() - stat.mtimeMs) / 3_600_000;
    } catch {
      // No marker = first session or marker lost, inject welcome back
    }

    // Update marker for next check
    try {
      fs.writeFileSync(MARKER_FILE, new Date().toISOString());
    } catch { /* ignore */ }

    if (hoursSince < MIN_AWAY_HOURS) {
      return; // Still in active work mode
    }

    // Find and read latest savepoint
    const savepoint = findLatestSavepoint();
    if (!savepoint) return;

    const summary = extractSummary(path.join(MEMORY_DIR, savepoint));
    if (!summary) return;

    const awayLabel = hoursSince === Infinity
      ? 'Welcome back'
      : `Back after ${Math.round(hoursSince)}h`;

    const output = JSON.stringify({
      additionalContext: `[${awayLabel}] Last session: ${summary}. Savepoint: ${savepoint}. Check MEMORY.md for full project context.`
    });

    process.stdout.write(output);
  } catch {
    // Silent failure — never block startup
  }
}

main();
