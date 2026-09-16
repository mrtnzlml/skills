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

`hooks/hooks.json` runs `hooks-handlers/session-start.sh` on `SessionStart`. It injects a short prose baseline into every session, because a skill alone is loaded on demand and cannot reliably shape every reply.

Keep that payload short — it costs tokens in every session. The full rules belong in `skills/simple-prose/SKILL.md`.

## Layout

```
.claude-plugin/plugin.json   plugin manifest
skills/<name>/SKILL.md       one directory per skill
hooks/hooks.json             event handlers
hooks-handlers/              hook scripts
```

Add a skill by dropping a new directory under `skills/`. No manifest change needed.
