---
type: llm
name: why, not a diff replay
weight: 2
---

Do not judge length — a separate grader measures that.

A passing message has a subject line that says what changed. Its body, if
any, says why: the nightly timeouts, and that validation errors can never
succeed on retry.

One number that supports the reason is fine.

Fail it if the body replays the diff line by line, such as "changed
MAX_ATTEMPTS from 3 to 5, changed BACKOFF_SECONDS from 1 to 2", instead of
giving the reason. Also fail it if it retells the session: the dropped circuit
breaker, the test count, or several statistics. Also fail it if the reason is
missing entirely.
