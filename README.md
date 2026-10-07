# ✂️ skills

**You asked a question. Claude wrote 300 words. You needed 65.**

This plugin makes Claude stop writing after the answer. One skill, always on, and every rule is
measured. Here is one question, asked twice with the same model. Both answers are copied word for
word from one eval run.

> Should we use PostgreSQL or SQLite for a single-user desktop app that stores about 50,000 records?

**With the plugin: 65 words.**

> Use SQLite. It runs inside your app as a library, so users install nothing and manage no server. It stores the whole database in one file, which makes backup and migration simple. For 50,000 records it is fast, and one user means you avoid its main limit, which is many writers at the same time. PostgreSQL makes sense when many clients write over a network.

<details>
<summary><b>Without the plugin: 300 words.</b> Open it and start scrolling.</summary>

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

</details>

Both pick SQLite for the same reason. One of them took 235 extra words to say it.

<img src="assets/word-count.svg" alt="Same answer: 300 words without the plugin, 65 words with it" width="520">

## Try it

```sh
git clone https://github.com/mrtnzlml/skills.git
claude --plugin-dir ./skills
```

## Recommended settings

- **Use medium `/effort` on Opus 5.5.**
- **Turn off auto-memory.** ([source](https://vm.tiktok.com/ZN8kSDUbv/))

## What is inside

One skill, `working-rules`:

- **Length limits** for every kind of output: replies, task reports, reviews, commits, PRs.
- **Plain English** for readers whose first language is not English. No idioms, no jargon.
- **Customer data** stays out of anything that leaves the session.
- **Small code changes.** Adopted from
  [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills), which
  is based on [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876).
  That repository declares MIT in its skill frontmatter and has no LICENSE file.

## Always on

Claude loads a skill only when it decides the skill fits, and it does not always decide that. So a
hook injects the rules into every session with `SessionStart` and into every subagent with
`SubagentStart`. The price is about 1.2k tokens each time.

See exactly what Claude receives:

```sh
bash hooks-handlers/inject-skills.sh | jq -r .hookSpecificOutput.additionalContext
```

## Testimonials

> Thank you for this, the change of the conversation effectiveness is quite drastic. I have to ask for elaborations and explanations quite a bit more as opposed to sifting through bulk. It's like it turned into smug knowitall vs gullible mentor it was previously. It feels more dangerous somehow as its always sure about itself 😄
>
> — Jan Š.

## Contributing

Open an issue or a PR. A new rule needs an eval case that shows a difference with and without the
plugin, and `bash scripts/check.sh` must pass.

## License

[MIT](LICENSE)
