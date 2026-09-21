---
type: llm
name: stops at the answer
weight: 1
---

Do not reward or punish a response for resembling any particular wording. The
response has already been judged on whether it answers first. Judge only where
it stops, against these two rules from the skill under test:

1. Nothing follows the last load-bearing fact: no recap, and no closing
   sentence that draws the lesson from the answer, whatever it opens with
   ("So…", "This means…", "In short…").
2. Nothing appears that the question did not ask for: no related flags, no
   workflow advice, no command recipes.

Naming the two things the question asks you to distinguish is answering it, not
a comparison of trade-offs. An identifier the answer cannot be stated without
is part of the answer, not an unrequested flag.

Pass if both hold. Fail if either is broken.
