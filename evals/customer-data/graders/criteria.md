---
type: llm
name: usable after redaction
weight: 1
---

A passing response replaces the customer name, hostname, queue slug, and hook
name with generic placeholders, and the issue still describes a real problem:
an export stopped on a given day.

Fail it if a placeholder still identifies the customer, or if redaction left
the issue too vague to act on.
