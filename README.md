# ✂️ skills

Claude writes too much. This plugin makes it stop. 🤐

## 🥊 Before and after

Same question, same model. Both answers are copied word for word from one eval run.

> Should we use PostgreSQL or SQLite for a single-user desktop app that stores about 50,000 records?

**✅ With the plugin: 65 words.**

> Use SQLite. It runs inside your app as a library, so users install nothing and manage no server. It stores the whole database in one file, which makes backup and migration simple. For 50,000 records it is fast, and one user means you avoid its main limit, which is many writers at the same time. PostgreSQL makes sense when many clients write over a network.

**😵 Without the plugin: 300 words.**

> **Use SQLite.** For a single-user desktop app with about 50,000 records, it's the clear choice.
>
> **Why SQLite fits:**
> - **Nothing to install or run.** It's a library inside your app, and the whole database is one file. With PostgreSQL, every user would need a database server installed, configured, started and upgraded, which is a lot to ask of a desktop app.
> - **50k records is small.** SQLite handles millions of rows easily. With sensible indexes, queries at your size will take milliseconds.
> - **Backup and migration are simple.** Copying the file is a backup. Moving the file moves the data.
> - **It's reliable.** It supports ACID transactions and is heavily tested. It's used inside browsers, phones and many desktop apps.
> - **Support is everywhere.** Every major language and ORM supports it, and some platforms include it by default (for example, Python's `sqlite3` module).
>
> **When PostgreSQL would make sense instead:**
> - Many users or processes writing to the same database at once. SQLite allows only one writer at a time, which doesn't matter for a single user.
> - A shared database on a server that several clients connect to.
> - A need for Postgres-specific features, such as advanced JSONB indexing, PostGIS, or detailed roles and permissions.
> - A near-term plan to turn the app into a multi-user web service. Even then, it's usually easier to start with SQLite and migrate later, especially if you use an ORM or query builder.
>
> **Tips if you go with SQLite:**
> - Turn on WAL mode (`PRAGMA journal_mode=WAL;`). Reads and writes block each other less, and it's more resilient.
> - Turn on `PRAGMA foreign_keys=ON;`, since it's off by default.
> - Store the database file in the OS's standard app-data folder, not next to the executable.
> - Add indexes for the columns you filter or sort on.

Both pick SQLite for the same reason. You had to scroll to get to the end of the second one. 📜

## 🚀 Try it

```sh
git clone https://github.com/mrtnzlml/skills.git
claude --plugin-dir ./skills
```

## 🎁 What is inside

One skill, `working-rules`:

- 📏 **Length limits** for every kind of output: replies, task reports, reviews, commits, PRs.
- 🌍 **Plain English** for readers whose first language is not English. No idioms, no jargon.
- 🔒 **Customer data** stays out of anything that leaves the session.
- 🔧 **Small code changes.** Adopted from
  [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills), which
  is based on [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876).
  That repository declares MIT in its skill frontmatter and has no LICENSE file.

## 🔌 Always on

Claude loads a skill only when it decides the skill fits, and it does not always decide that. So a
hook injects the rules into every session with `SessionStart` and into every subagent with
`SubagentStart`. The price is about 1.2k tokens each time.

See exactly what Claude receives:

```sh
bash hooks-handlers/inject-skills.sh | jq -r .hookSpecificOutput.additionalContext
```

## 🧪 Proof

Every rule has to show that it changes something. `claude plugin eval .` runs each case twice, with
and without the plugin, and reports the difference. A rule that makes no difference gets deleted,
and several already have been.

```sh
bash scripts/check.sh                                              # free, no API
claude plugin eval . --runs 10 --no-publish && bash scripts/snapshot.sh
```

`evals/snapshot.md` holds the latest scores. What the evals taught us:

- 🎯 **One rule per grader.** A judge that checks four rules at once reports one fail and hides which rule broke.
- ⚖️ **Check that a judge can pass.** A grader that never passes measures nothing.
- 🔁 **Use `--runs 10`.** At 3 runs the baseline moved by 24 points with nothing changed.
- 🎲 **Treat a swing under 15 points on one case as noise**, even at 10 runs.

`scripts/check.sh` pins one phrase per rule to its eval case. Delete a rule but keep its case, and
the check fails. Add a case that tests no pinned rule, and it fails too.
