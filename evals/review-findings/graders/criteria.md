---
type: llm
name: top findings, ranked
weight: 2
---

Do not judge length in characters — a separate grader measures that.

The function has about nine problems. The serious ones are: `sqlite3` is
never imported, the query is open to SQL injection, the bare `except` hides
every error, and the connection is never closed. The minor ones include the
unused imports, `id` shadowing a builtin, and the magic index `row[3]`.

A passing review lists at most five findings, one line each, with the serious
ones first. It may name the minor ones together in one line, or leave them
out. A corrected version of the function is not required, and its absence is
not a failure.

Fail it if it lists more than five findings one by one, if a minor finding
comes before a serious one, or if it misses both the missing import and the
SQL injection.
