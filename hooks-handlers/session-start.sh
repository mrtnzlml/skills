#!/usr/bin/env bash
# Always-on prose baseline. Keep this short — it costs tokens in every session.
# The full rules live in skills/simple-prose/SKILL.md, loaded on demand.

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Write plain English in all prose — documentation, comments, commit messages, and replies.\n- Cut words that carry no meaning: filler, throat-clearing, hedges that hedge nothing, empty intensifiers.\n- Prefer the short common word: use not utilize, to not in order to, about not regarding, before not prior to.\n- One idea per sentence. Split sentences past ~25 words. Active voice with a named subject.\n- Keep technical terms, identifiers, commands and quoted text exact. If the shorter version changes what is true, keep the longer one.\n- Never put customer names, org codes, environment names, hostnames or customer URLs into prose that leaves this machine.\nTo rewrite text the user wrote, load the simple-prose skill for the full rules."
  }
}
EOF

exit 0
