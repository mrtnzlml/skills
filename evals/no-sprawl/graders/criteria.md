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
