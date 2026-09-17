---
type: llm
name: answers first
weight: 2
---

The question has a one-sentence answer: `git fetch` downloads without merging
or touching the working tree, and `git pull` fetches and then merges.

Pass a response that opens with that answer and stops once it is complete.
Around 80 words is right. A second short paragraph is fine when it adds a fact
the answer needs.

Fail it if the answer arrives only after scene-setting, if the response runs
past roughly 120 words, or if it volunteers material nobody asked for:
workflow recommendations, related flags, command recipes, safety comparisons.
