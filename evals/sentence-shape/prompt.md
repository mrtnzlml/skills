---
max_turns: 4
allowed_tools: [Skill]
---

Turn these notes into one README paragraph. Do not ask for the repository; the
notes are all you need.

- A SessionStart hook runs a command when a session opens. Its stdout is added
  to the context.
- A skill is only read when the model decides the skill's description matches
  the task in front of it.
- Rules that must shape every reply cannot wait for that decision.
