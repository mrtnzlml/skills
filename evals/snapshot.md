# Eval snapshot

The newest `claude plugin eval .` run, distilled. Regenerate with
`scripts/snapshot.sh`. A delta of zero means the model already behaves
that way and the rule is paying rent for nothing.

_2026-09-21 · claude 2.1.278 · 10 runs per arm · $16.39_

| case | with | without | delta |
| --- | --: | --: | --: |
| customer-data | 100% | 0% | +100pp |
| no-sprawl | 100% | 8% | +92pp |
| answer-first | 80% | 20% | +60pp |
| no-over-structure | 100% | 43% | +57pp |
| sentence-shape | 80% | 38% | +42pp |
| no-idioms | 75% | 50% | +25pp |
| plain-words | 100% | 95% | +5pp |
| surgical-change | 100% | 100% | +0pp |
| keep-accuracy | 95% | 100% | -5pp |

**5 of 9 cases passed.** Mean delta 42pp.
