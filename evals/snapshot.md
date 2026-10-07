# Eval snapshot

The newest `claude plugin eval .` run, distilled. Regenerate with
`scripts/snapshot.sh`. A delta of zero means the model already behaves
that way and the rule changes nothing.

_2026-10-07 · claude 2.1.292 · 10 runs per arm_

| case | with | without | delta |
| --- | --: | --: | --: |
| no-over-structure | 100% | 0% | +100pp |
| customer-data | 98% | 0% | +98pp |
| pr-description | 100% | 4% | +96pp |
| no-sprawl | 100% | 4% | +96pp |
| review-findings | 92% | 8% | +84pp |
| answer-first | 98% | 18% | +80pp |
| sentence-shape | 94% | 22% | +72pp |
| commit-message | 92% | 28% | +64pp |
| task-report | 100% | 40% | +60pp |
| no-idioms | 100% | 60% | +40pp |
| keep-accuracy | 100% | 100% | +0pp |

**11 of 11 cases passed.** Mean delta 72pp.
