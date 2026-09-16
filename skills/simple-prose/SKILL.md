---
name: simple-prose
description: Use when writing or editing any prose — documentation, READMEs, comments, commit messages, PR descriptions, issues, chat replies — or when asked to tighten, simplify, shorten, or improve text. Cuts verbosity, prefers plain English over formal or padded wording, and keeps customer-identifying details out of shared text.
---

# Simple Prose

Write so a tired reader understands on the first pass. Fewer words, shorter words, one idea at a time.

## Cut

- **Filler and throat-clearing.** "It is important to note that", "basically", "essentially", "as you know", "in this section we will".
- **Hedges that hedge nothing.** "somewhat", "fairly", "I think", "it seems like" — when the statement is simply true.
- **Restating.** Do not repeat the question before answering it. Do not summarize what you just said.
- **Empty intensifiers.** "very", "really", "quite", "extremely", "truly".
- **Long sentences.** Past ~25 words, split it. One idea per sentence.
- **Passive voice** used without a reason. Name the actor: "the hook writes the file", not "the file is written".

Prefer the short common word:

| Instead of | Write |
| --- | --- |
| utilize | use |
| in order to | to |
| regarding / with regard to | about |
| prior to | before |
| subsequent to | after |
| sufficient | enough |
| additional | more |
| terminate | end |
| initiate | start |
| demonstrate | show |
| approximately | about |
| a large number of | many |
| at this point in time | now |
| due to the fact that | because |
| in the event that | if |
| has the ability to | can |

## Never cut

Simple is not vague. Keep:

- Technical terms, API names, identifiers, commands, flags, file paths, code, and quoted text — exactly as written.
- Qualifiers that carry real uncertainty. "Usually" is meaning when something is usually true. Only cut a hedge that hedges nothing.
- Conditions, caveats, and exceptions that change what is true.

**If the shorter version changes what is true, keep the longer one.** Precision beats brevity every time.

## Customer data

Before prose goes anywhere shared — docs, commits, PRs, issues, messages, pasted output — scan for:

- customer or company names
- org, division, and region codes
- environment names and queue / hook / engine slugs
- hostnames, URLs, and customer file paths

Replace each with a generic placeholder and say what was replaced. Never pick a substitute that still identifies the customer.

## Showing your work

- **Prose Claude writes** (its own docs, commits, replies): apply these rules silently. No commentary.
- **Text the user wrote:** give the rewrite, then list the substantive changes, one line each. No lecture, no praise.

Example of the change list:

> - "in order to" → "to"
> - cut 2 hedges ("somewhat", "I think")
> - split a 41-word sentence in two
