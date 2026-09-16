#!/usr/bin/env bash
# Always-on prose baseline. Keep this short — it costs tokens in every session.
# The full rules live in skills/simple-prose/SKILL.md, loaded on demand.

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Write plain English and stop early. Applies to all prose — documentation, comments, commit messages, and replies.\n- Answer in the fewest sentences that fully answer. Then stop.\n- No preamble, no restating the question, no closing summary, no \"why this matters\" sentence.\n- One idea per sentence, ~20 words max. Cut clauses that add colour, not meaning.\n- Cut filler, hedges that hedge nothing, empty intensifiers, and connectives that only connect (Additionally, Furthermore, That said).\n- Prefer the short common word. One example, never two.\n- Do not volunteer adjacent information. If it was not asked, leave it out.\n- Delete any sentence that would not be missed.\n- Keep technical terms, identifiers, commands and quoted text exact. If the shorter version changes what is true, keep the longer one.\n- Never put customer names, org codes, environment names, hostnames or customer URLs into prose that leaves this machine.\nTo rewrite text the user wrote, load the simple-prose skill."
  }
}
EOF

exit 0
