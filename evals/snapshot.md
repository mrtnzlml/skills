# Eval snapshot

The newest `claude plugin eval .` run, distilled. Regenerate with
`scripts/snapshot.sh`. A delta of zero means the model already behaves
that way and the rule changes nothing.

_2026-09-30 · claude 2.1.285 · 10 runs per arm_

| case | with | without | delta |
| --- | --: | --: | --: |
| no-over-structure | 100% | 0% | +100pp |
| customer-data | 100% | 0% | +100pp |
| pr-description | 100% | 8% | +92pp |
| no-sprawl | 100% | 8% | +92pp |
| review-findings | 100% | 16% | +84pp |
| answer-first | 96% | 32% | +64pp |
| commit-message | 88% | 24% | +64pp |
| sentence-shape | 82% | 20% | +62pp |
| task-report | 100% | 40% | +60pp |
| no-idioms | 90% | 55% | +35pp |
| keep-accuracy | 95% | 100% | -5pp |

**6 of 11 cases passed.** Mean delta 68pp.
