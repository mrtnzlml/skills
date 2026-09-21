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

`hooks/hooks.json` runs `hooks-handlers/inject-skills.sh` on two events. The script reads the skills
named in its `ALWAYS_ON` list, strips their frontmatter, and injects the full text. A name with no
matching file is skipped with a message on stderr. A skill on its own is loaded on demand, which is
not reliable enough for rules that must shape every reply.

| Event | Why |
| --- | --- |
| `SessionStart` | The main thread. |
| `SubagentStart` | `SessionStart` context does not reach a `Task`-spawned agent, so without this every subagent writes unruled prose. |

`working-rules` is always on today. That costs about 1.7k tokens per session, and again per
subagent.

To make another skill always-on, add its directory name to `ALWAYS_ON`. Everything else stays on
demand — do not add a skill there unless it applies to all work.

Check what gets injected:

```sh
bash hooks-handlers/inject-skills.sh | jq -r .hookSpecificOutput.additionalContext
```

Needs `jq`.

## Checks

`scripts/check.sh` is free, deterministic, and calls no API. The evals measure whether a rule
changes the model's behaviour; these checks measure whether it reaches the model at all.

```sh
bash scripts/check.sh
```

It asserts that both events emit valid JSON, that no frontmatter leaks through, that a missing
skill name degrades to a warning instead of an empty injection, and that the injected text stays
under a byte ceiling — the README quotes that cost, so growing past it is a decision.

It also pins one load-bearing phrase per eval case. Deleting a rule without deleting its case, or
adding a case that grades no pinned rule, fails the check. A rule nobody grades is a rule nobody
can defend.

## Evals

`claude plugin eval .` runs the suite in `evals/`. Each case is a `prompt.md` plus graders that are
either `regex` (deterministic, free) or `llm` (judged, costs a little).

It defaults to `--ablation with-without`, which runs every case twice — once with the plugin loaded
and once without — and reports the delta. That delta is the only evidence that a rule in the skill
changes anything. A case with a delta of zero is telling you the model already behaves that way.

**One rule per grader.** An LLM grader that ANDs four conditions into one verdict reports a single
fail and hides which condition broke. `answer-first` sat at exactly 60% across three different
versions of the skill because its judge bundled four rules and never once passed — 0 of 60 runs,
both arms. Split into "answers first" and "stops at the answer", the same runs read 8/10 and 2/10:
the skill was working on one half and failing the other, and the bundled score could not say so.
Before trusting a judge, check that it passes something. A grader that never passes is a constant,
not a measurement.

`--runs 3` is too few. The no-plugin arm is the same baseline every time, so it should not move
between runs; at 3 runs it moved by up to 24 points. Use `--runs 10` for anything you intend to
act on, and treat a swing under about 15 points on a single case as noise even then.

```sh
claude plugin eval . --runs 1 --no-publish    # quick, noisy, about $0.85
claude plugin eval . --runs 10 --no-publish   # what a decision needs, about $16
```

Results land in `evals/results/`, which is gitignored because each run is about 190k of JSON and
HTML. `scripts/snapshot.sh` distils the newest run into `evals/snapshot.md`, which is committed —
one row per case, small enough to read as a diff. That file is where a rule's delta going to zero
becomes visible in the history rather than only on the machine that ran it.

```sh
claude plugin eval . --runs 10 --no-publish && bash scripts/snapshot.sh
```

## What a plugin cannot do

A plugin can ship a `settings.json`, but Claude Code filters it to an allowlist — `agent` and
`subagentStatusLine` — and silently drops everything else. There is no warning; the keys just do
nothing. Settings like `spinnerVerbs` or `alwaysThinkingEnabled` have to live in
`~/.claude/settings.json`.

Check what survived with:

```sh
claude --plugin-dir . --debug --debug-file /tmp/cc.log -p "ok" && grep "plugin settings" /tmp/cc.log
```

## Layout

```
.claude-plugin/plugin.json   plugin manifest
skills/<name>/SKILL.md       one directory per skill
hooks/hooks.json             event handlers
hooks-handlers/              hook scripts
scripts/check.sh             deterministic checks, no API
scripts/snapshot.sh          distils the newest eval run
evals/<case>/prompt.md       eval cases and their graders
evals/snapshot.md            committed per-case deltas
```

Add a skill by dropping a new directory under `skills/`. No manifest change needed.
