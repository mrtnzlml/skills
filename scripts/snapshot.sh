#!/usr/bin/env bash
# Distils the newest eval run into evals/snapshot.md, which is committed.
#
# The full aggregate-result.json is ~190k and gitignored, so the evidence for
# keeping or deleting a rule lives only on the machine that ran it. This writes
# the part that matters — the per-case delta — as a file small enough to read
# as a diff. A case whose delta drops to zero is the argument for deleting the
# rule it grades.
#
# Usage: scripts/snapshot.sh [aggregate-result.json]

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="$root/evals/snapshot.md"

if [[ $# -ge 1 ]]; then
  result="$1"
else
  # Timestamped directory names sort chronologically, so the last is the newest.
  result="$(find "$root/evals/results" -name aggregate-result.json 2>/dev/null | sort | tail -1)"
fi

if [[ -z "${result:-}" || ! -f "$result" ]]; then
  echo "snapshot.sh: no eval result found, run 'claude plugin eval .' first" >&2
  exit 1
fi

{
  echo "# Eval snapshot"
  echo
  echo "The newest \`claude plugin eval .\` run, distilled. Regenerate with"
  echo "\`scripts/snapshot.sh\`. A delta of zero means the model already behaves"
  echo "that way and the rule changes nothing."
  echo
  # runsPerCase is the case file's declared default and ignores --runs, so count
  # the runs actually recorded. A snapshot that misreports n is worse than none:
  # n is what says whether a delta is solid or noise.
  jq -r '"_" + (.startedAt | split("T")[0]) + " · claude " + .claudeVersion
    + " · " + (.cases[0].arms.with | length | tostring) + " runs per arm_"' "$result"
  echo
  echo "| case | with | without | delta |"
  echo "| --- | --: | --: | --: |"
  jq -r '.cases | sort_by(.aggregates.delta) | reverse | .[]
    | "| \(.name) | \(.aggregates.score * 100 | round)% | \(.aggregates.scoreWithout * 100 | round)% | \(if .aggregates.delta >= 0 then "+" else "" end)\(.aggregates.delta * 100 | round)pp |"' "$result"
  echo
  jq -r '"**" + (.aggregates.casesPassed | tostring) + " of " + (.aggregates.casesTotal | tostring)
    + " cases passed.** Mean delta " + (.aggregates.meanDelta * 100 | round | tostring) + "pp."' "$result"
} >"$out"

echo "wrote $out"
