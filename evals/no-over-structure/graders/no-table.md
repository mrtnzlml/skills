---
type: regex
name: no table or bullet scaffolding
pattern: '^\s*(\||[-*+] |\d+\. )'
flags: 'm'
match: not_contains
weight: 2
---
