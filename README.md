# skills

Personal Claude Code plugin. The repository root is the plugin.

## Load it

```sh
git clone https://github.com/mrtnzlml/skills.git
claude --plugin-dir ./skills
```

The flag is repeatable, and it works alongside plugins installed from a marketplace.

## Skills

`working-rules` is the only skill. It cuts verbosity, prefers plain English, keeps
customer-identifying details out of shared text, and holds the coding rules that keep changes small
and surgical. The coding half is adopted from
[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills).

## Always-on hook

`hooks/hooks.json` runs `hooks-handlers/session-start.sh` on `SessionStart`. The script reads the
skills named in its `ALWAYS_ON` list, strips their frontmatter, and injects the full text into every
session. A name with no matching file is skipped with a message on stderr. A skill on its own is
loaded on demand, which is not reliable enough for rules that must shape every reply.

`working-rules` is always on today. That costs about 1.5k tokens per session.

To make another skill always-on, add its directory name to `ALWAYS_ON`. Everything else stays on
demand — do not add a skill there unless it applies to all work.

Check what gets injected:

```sh
bash hooks-handlers/session-start.sh | jq -r .hookSpecificOutput.additionalContext
```

Needs `jq`.

## Evals

`claude plugin eval .` runs the suite in `evals/`. Each case is a `prompt.md` plus graders that are
either `regex` (deterministic, free) or `llm` (judged, costs a little).

It defaults to `--ablation with-without`, which runs every case twice — once with the plugin loaded
and once without — and reports the delta. That delta is the only evidence that a rule in the skill
changes anything. A case with a delta of zero is telling you the model already behaves that way.

```sh
claude plugin eval . --runs 1 --no-publish   # quick, noisy, about $0.85
claude plugin eval .                         # 3 runs per arm, about $2.50
```

Results land in `evals/results/`, which is gitignored.

## Spinner verbs

`settings.json` at the plugin root is loaded automatically and replaces the stock spinner verbs.
Delete the file to get the 193 defaults back.

## Layout

```
.claude-plugin/plugin.json   plugin manifest
settings.json                settings the plugin contributes
skills/<name>/SKILL.md       one directory per skill
hooks/hooks.json             event handlers
hooks-handlers/              hook scripts
evals/<case>/prompt.md       eval cases and their graders
```

Add a skill by dropping a new directory under `skills/`. No manifest change needed.
