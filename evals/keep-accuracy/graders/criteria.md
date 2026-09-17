---
type: llm
name: meaning survives the cut
weight: 2
---

Judge the rewritten paragraph only. The response may also carry a list of the
changes made, and that list quotes the filler it removed — quoted filler in the
change list is correct behaviour, never a failure.

The rewrite must be shorter than the original and must still carry both facts
that change what is true:

- The fallback is conditional. It happens only when the variable is unset.
- The fallback URL is not pinned, so it can change between runs.

It must also have dropped the padding: "It is important to note that" and
"in the event that" must be gone from the rewrite itself.

Fail it if either fact is dropped or softened, or if the rewrite is shorter
because it deleted the caveat rather than the padding.
