---
name: simple-prose
description: Use when writing or editing any prose — documentation, READMEs, comments, commit messages, PR descriptions, issues, chat replies — or when asked to tighten, simplify, shorten, structure, or improve text. Cuts length hard, structures what remains so it can be skimmed, and keeps customer-identifying details out of shared text.
---

# Simple Prose

Optimise for time to understand, not word count. Cut words that do not earn their place, then structure what remains.

## Length

Most prose is too long because it keeps going after the answer. Fix that first.

- **Answer first**, in one sentence where possible. Add more only if the answer is wrong without it.
- **No preamble.** Do not restate the question or announce what you are about to say.
- **No closing summary.** No "why this matters" sentence, no "in short", no recap of what the reader just read.
- **~20 words per sentence.** Past that, split or cut.
- **One example, never two.** One qualifier, never three.
- **Do not volunteer adjacent information.** If it was not asked, leave it out.
- **Delete any sentence that would not be missed.**

Structure does not exempt you from this. A list of padded bullets is still padded.

## Structure

Structure appears only when the content earns it:

| Trigger | Form |
| --- | --- |
| Under ~50 words | Plain sentences. Nothing else. |
| 3 or more parallel items | Bullets |
| 2 or more things compared across 2 or more attributes | Table |
| 3 or more distinct parts | Headings |
| Directory layout or hierarchy | ASCII tree |
| A sequence of 3 or more stages | ASCII arrow chain |
| 3 or more numbers compared | ASCII bar row |

Formatting:

- **Lead with the key term**, bolded, when the reader will scan rather than read.
- **One line per bullet.** If it needs two sentences, it is a paragraph.
- **Three sentences per paragraph**, maximum.
- **Backticks** on commands, paths, flags, and identifiers.

Draw the shape. Do not describe it in words instead.

**Tree** — directory layout, hierarchy, nesting:

```
plugin/
├── .claude-plugin/plugin.json
├── skills/<name>/SKILL.md
└── hooks/hooks.json
```

**Arrow chain** — a sequence of 3 or more stages:

```
upload -> OCR -> extract -> validate -> review -> export
```

**Bar row** — 3 or more numbers compared. Always draw this; the outlier
should be visible without reading the figures:

```
suite A   ||                 12s
suite B   |||||||            47s
suite C   |                   9s
suite D   ||||||||||||||||||||||  130s
```

**Box** — one warning per answer that must not be missed:

```
+------------------------------------------+
| Pushing rewrites public history           |
+------------------------------------------+
```

Plain ASCII, 60 columns or fewer.

## Never over-structure

```
+--------------------------------------------+
| If removing the structure loses nothing,   |
| remove it.                                 |
+--------------------------------------------+
```

- No one-row table. No two-item bullet list. No heading above a single paragraph.
- No diagram that only repeats a sentence. A chain or bar row that lets the reader
  see the shape at a glance is not decoration — draw it.
- Never fragment a flowing explanation to make it look structured.
- A short answer needs no scaffolding. Prose is the default, not the fallback.

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
