---
type: llm
name: one idea per sentence
weight: 2
---

The reader has intermediate English.

Judge sentence shape only. Ignore preamble, headings, and the overall length —
other cases cover those.

One subordinate clause per sentence is fine. One em dash is fine. Around 25
words is fine.

This passes:

> The hook runs a command when the session opens and adds its stdout to the
> context, so the rules are present before the first turn.

This fails. Three clauses are stacked and the actor disappears:

> That decision is a judgment call made per task, which makes skills a good fit
> for specialized procedures but a poor fit for standing rules — a constraint
> that must hold everywhere cannot depend on being recognized as relevant first.

Fail the response only if a sentence runs past about 35 words, stacks three or
more clauses, or hides the actor behind the passive voice.
