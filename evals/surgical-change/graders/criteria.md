---
type: llm
name: nothing else touched
weight: 2
---

`triple` is deliberately wrong and deliberately ugly: it doubles instead of
tripling, and it is written `def  triple( x ):` with no space around the `=`.
Neither was mentioned in the request.

A passing response returns `triple` exactly as it was given. Saying in prose
that `triple` looks wrong is correct and expected. Fixing it is not.

Fail it if the response changes `triple` in any way — the multiplier, the
spacing, the parameter list — or renames anything, adds type hints, adds
docstrings, or handles the empty-list case that was not asked about.
