#!/usr/bin/env bash
# Deterministic checks on the always-on injection. No API calls, no cost.
#
# The evals measure whether a rule changes the model's behaviour. These checks
# measure whether the rule reaches the model at all, and what it costs to send.

set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
hook="$root/hooks-handlers/inject-skills.sh"

# Roughly 4 bytes per token. The README quotes what this text costs in every
# session; growing past the ceiling is a decision, not an accident.
#
# Raised from 8000 when the worked examples went in. If their eval delta does
# not justify 1.1k bytes in every session and every subagent, they come back
# out and this goes back down.
CEILING_BYTES=9000

# One load-bearing phrase per eval case. The phrase pins the rule, the case
# measures it. Deleting either without the other trips this check, which is the
# reminder that a rule nobody grades is a rule nobody can defend.
INVARIANTS=(
  'answer-first|Answer first'
  'customer-data|Never leak a customer name'
  'keep-accuracy|If the shorter version changes what is true, keep the longer one.'
  'no-idioms|Idioms and figures of speech'
  'no-over-structure|Never over-structure'
  'no-sprawl|Under 80 words'
  'plain-words|good but not native'
  'sentence-shape|~20 words per sentence'
  'surgical-change|Keep existing callers working'
)

fail=0

pass() { printf '  ok    %s\n' "$1"; }
bad() { printf '  FAIL  %s\n' "$1"; fail=1; }

echo "injection"

for event in SessionStart SubagentStart; do
  out="$(bash "$hook" "$event" 2>/dev/null)"
  name="$(printf '%s' "$out" | jq -r '.hookSpecificOutput.hookEventName' 2>/dev/null)"
  if [[ "$name" == "$event" ]]; then
    pass "$event emits valid JSON for its own event"
  else
    bad "$event emitted '$name'"
  fi
done

context="$(bash "$hook" 2>/dev/null | jq -r '.hookSpecificOutput.additionalContext')"

if [[ -z "$context" || "$context" == "null" ]]; then
  bad "no context to check"
  exit 1
fi

# A leaked '---' means the frontmatter stripper missed, and the model reads the
# discovery metadata as if it were a rule.
if printf '%s' "$context" | grep -qx -- '---'; then
  bad "frontmatter leaked into the context"
else
  pass "frontmatter stripped"
fi

echo
echo "budget"

bytes=$(printf '%s' "$context" | wc -c | tr -d ' ')
if [[ "$bytes" -le "$CEILING_BYTES" ]]; then
  pass "$bytes bytes, about $((bytes / 4)) tokens (ceiling $CEILING_BYTES)"
else
  bad "$bytes bytes exceeds the $CEILING_BYTES ceiling"
fi

echo
echo "rules and their evidence"

for pair in "${INVARIANTS[@]}"; do
  case_name="${pair%%|*}"
  phrase="${pair#*|}"
  if [[ ! -d "$root/evals/$case_name" ]]; then
    bad "$case_name: pinned rule has no eval case"
  elif ! printf '%s' "$context" | grep -qF -- "$phrase"; then
    bad "$case_name: rule missing from the context: \"$phrase\""
  else
    pass "$case_name"
  fi
done

for dir in "$root"/evals/*/; do
  case_name="$(basename "$dir")"
  [[ "$case_name" == "results" ]] && continue
  if ! printf '%s\n' "${INVARIANTS[@]}" | grep -q "^$case_name|"; then
    bad "$case_name: eval case pins no rule"
  fi
done

echo
echo "recovery"

# One bad name in ALWAYS_ON must not cost every other skill, so the hook warns
# and still emits usable JSON. Point it at an empty root to force that path.
empty="$(mktemp -d)"
trap 'rm -rf "$empty"' EXIT
err="$(CLAUDE_PLUGIN_ROOT="$empty" bash "$hook" 2>&1 >/dev/null)"
out="$(CLAUDE_PLUGIN_ROOT="$empty" bash "$hook" 2>/dev/null)"
if [[ "$err" == *"no such skill"* ]] && printf '%s' "$out" | jq -e . >/dev/null 2>&1; then
  pass "a missing skill warns and still emits valid JSON"
else
  bad "a missing skill breaks the hook"
fi

echo
if [[ "$fail" -eq 0 ]]; then
  echo "all checks passed"
else
  echo "checks failed"
fi
exit "$fail"
