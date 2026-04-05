#!/usr/bin/env bash
# Restore skill graph MOCs from claudecodemem backup
# Run after a PC reset to rebuild the _mocs/ navigation layer

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$HOME/.claude/skills"

echo "Restoring skill graph MOCs..."

# Create _mocs directory
mkdir -p "$SKILLS_DIR/_mocs"

# Copy MOCs
cp "$REPO_DIR/skills/_mocs/"*.md "$SKILLS_DIR/_mocs/"
echo "  Copied $(ls "$SKILLS_DIR/_mocs/"*.md | wc -l) MOC files"

# Copy master index
cp "$REPO_DIR/skills/SKILLS.md" "$SKILLS_DIR/SKILLS.md"
echo "  Restored SKILLS.md graph index"

echo "Done. Skill graph restored with $(ls "$SKILLS_DIR/_mocs/" | wc -l) domain MOCs."
echo ""
echo "Note: Individual skills still need to be installed separately"
echo "(ECC, PM skills, marketing skills, etc.)"
