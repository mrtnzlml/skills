---
type: llm
name: change, reason, test plan
weight: 2
---

Do not judge length — a separate grader measures that.

A passing description says what changed (a `--dry-run` flag for `deploy`),
why (accidental production deploys), and how it was tested. It mentions the
`apply_plan` to `execute_plan` rename, because other code may call the old
name.

Fail it if any of those is missing. Also fail it if it walks through the
commits or the changed files one by one, or retells the session: the flag
names considered, the rollback time, or the test count.
