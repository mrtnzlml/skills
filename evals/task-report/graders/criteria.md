---
type: llm
name: result, verified, open
weight: 2
---

Do not judge length — a separate grader measures that.

A passing report says three things:

- The result: `parse_date` now accepts ISO 8601 strings with an offset.
- What was verified: the date tests passed.
- What is still open: the full suite was not run.

Mentioning `format_date` in one line is fine. Leaving it out is also fine.

Fail it if any of the three is missing, or if the report says or implies the
full suite passed. Also fail it if it replays the log step by step, such as
which files were read or each test one by one.
