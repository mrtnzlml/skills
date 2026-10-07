---
type: llm
name: recommends and stops
weight: 2
---

A passing response recommends one of the two databases in its first sentence
and gives the reason that decides it. SQLite is the better recommendation here,
but either is acceptable if the reason is sound.

Fail it if the response surveys both options before committing, hedges without
choosing, or continues into material nobody asked for: migration paths,
benchmarks, schema advice, backup strategy, or a concurrency discussion that
does not apply to a single user.

A reason for the choice is not extra material. "One file, so backup is simple"
is a reason; steps for taking backups are a strategy. One sentence that says
when the other database would be the better choice is also allowed.
