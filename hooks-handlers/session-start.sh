#!/usr/bin/env bash
# Injects the full text of the always-on skills into every session. A skill on
# its own is loaded on demand and cannot reliably shape every reply.
#
# Every name below costs that skill's full length in tokens in EVERY session.
# Add one only if it must apply to all work. Everything else stays on demand.

set -euo pipefail

ALWAYS_ON=(simple-prose karpathy-guidelines)

root="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

context="The skills below are already loaded. Follow them. Do not invoke them again."

for name in "${ALWAYS_ON[@]}"; do
  # Strip the YAML frontmatter: name and description only matter for discovery.
  context+=$'\n\n'"$(sed '1,/^---$/d' "$root/skills/$name/SKILL.md")"
done

jq -n --arg ctx "$context" \
  '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'
