#!/usr/bin/env bash
# Injects the full text of the always-on skills into every session. A skill on
# its own is loaded on demand and cannot reliably shape every reply.
#
# Runs on two events. SessionStart context reaches the main thread only, so
# SubagentStart repeats the injection for every Task-spawned agent. Both take
# the same additionalContext payload; only the event name differs.
#
# Every name below costs that skill's full length in tokens in EVERY session.
# Add one only if it must apply to all work. Everything else stays on demand.
#
# Usage: inject-skills.sh [SessionStart|SubagentStart]

set -euo pipefail

ALWAYS_ON=(working-rules)

event="${1:-SessionStart}"
root="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

if ! command -v jq >/dev/null 2>&1; then
  echo "inject-skills.sh: jq not found, injecting nothing" >&2
  exit 1
fi

# The name and description only matter for discovery. A plain sed range would
# swallow a whole file that has no frontmatter, so match the opening --- first.
strip_frontmatter() {
  awk 'NR == 1 && $0 == "---" { fm = 1; next }
       fm && $0 == "---"      { fm = 0; next }
       !fm' "$1"
}

context="The skills below are already loaded. Follow them. Do not invoke them again."

for name in "${ALWAYS_ON[@]}"; do
  file="$root/skills/$name/SKILL.md"
  if [[ ! -f "$file" ]]; then
    # Skip it rather than abort: one bad name must not cost every other skill.
    echo "inject-skills.sh: no such skill: $name" >&2
    continue
  fi
  context+=$'\n\n'"$(strip_frontmatter "$file")"
done

jq -n --arg event "$event" --arg ctx "$context" \
  '{hookSpecificOutput: {hookEventName: $event, additionalContext: $ctx}}'
