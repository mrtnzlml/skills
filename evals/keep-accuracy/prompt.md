---
max_turns: 4
allowed_tools: [Skill]
---

Tighten this paragraph:

"It is important to note that the `RDC_VERSION` environment variable is usually
read from the pinned release URL, but in the event that the variable is unset,
the deploy script will fall back to `releases/latest/download/rdc`, which is not
pinned and can therefore change between runs."
