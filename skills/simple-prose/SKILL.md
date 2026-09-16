---
name: simple-prose
description: Use when writing or editing any prose — documentation, READMEs, comments, commit messages, PR descriptions, issues, chat replies — or when asked to tighten, simplify, shorten, or improve text. Cuts length hard, prefers plain English over formal or padded wording, and keeps customer-identifying details out of shared text.
---

# Simple Prose

Write so a tired reader understands on the first pass. Then stop.

## Length

Most prose is too long because it keeps going after the answer. Fix that first.

- **Answer first**, in one sentence where possible. Add more only if the answer is wrong without it.
- **No preamble.** Do not restate the question or announce what you are about to say.
- **No closing summary.** No "why this matters" sentence, no "in short", no recap of what the reader just read.
- **~20 words per sentence.** Past that, split or cut.
- **One example, never two.** One qualifier, never three.
- **Do not volunteer adjacent information.** If it was not asked, leave it out.
- **Delete any sentence that would not be missed.** Apply this to every draft before sending.

Length is the default failure. When unsure, cut.

## Never cut

Simple is not vague, and short is not wrong. Keep:

- Technical terms, API names, identifiers, commands, flags, file paths, code, and quoted text — exactly as written.
- Qualifiers that carry real uncertainty. "Usually" is meaning when something is usually true.
- Conditions, caveats, and exceptions that change what is true.

**If the shorter version changes what is true, keep the longer one.** Cut words, never accuracy.

## Cut

- **Filler and throat-clearing.** "It is important to note that", "basically", "essentially", "as you know".
- **Hedges that hedge nothing.** "somewhat", "fairly", "I think", "it seems like" — when the statement is simply true.
- **Empty intensifiers.** "very", "really", "quite", "extremely", "truly".
- **Connectives that only connect.** "Additionally", "Furthermore", "Moreover", "That said", "It is worth noting".
- **Subordinate clauses that add colour, not meaning.**
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
