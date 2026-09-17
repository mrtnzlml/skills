# skills

Personal Claude Code plugin. The repository root is the plugin.

## Load it

```sh
git clone https://github.com/mrtnzlml/skills.git
claude --plugin-dir ./skills
```

The flag is repeatable, and it works alongside plugins installed from a marketplace.

## Skills

| Skill | What it does |
| --- | --- |
| `simple-prose` | Cuts verbosity, prefers plain English, keeps customer-identifying details out of shared text. |
| `karpathy-guidelines` | Reduces common LLM coding mistakes: over-engineering, scope creep, unrequested refactoring, vague success criteria. Adopted from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills). |

## Always-on hook

`hooks/hooks.json` runs `hooks-handlers/session-start.sh` on `SessionStart`. The script reads the
skills named in its `ALWAYS_ON` list, strips their frontmatter, and injects the full text into every
session. A skill on its own is loaded on demand, which is not reliable enough for rules that must
shape every reply.

Both skills are always on today. That costs about 2k tokens per session.

To make another skill always-on, add its directory name to `ALWAYS_ON`. Everything else stays on
demand — do not add a skill there unless it applies to all work.

Check what gets injected:

```sh
bash hooks-handlers/session-start.sh | jq -r .hookSpecificOutput.additionalContext
```

Needs `jq`.

## Layout

```
.claude-plugin/plugin.json   plugin manifest
skills/<name>/SKILL.md       one directory per skill
hooks/hooks.json             event handlers
hooks-handlers/              hook scripts
```

Add a skill by dropping a new directory under `skills/`. No manifest change needed.
