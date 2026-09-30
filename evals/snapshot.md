# Eval snapshot

The newest `claude plugin eval .` run, distilled. Regenerate with
`scripts/snapshot.sh`. A delta of zero means the model already behaves
that way and the rule is paying rent for nothing.

_2026-09-30 · claude 2.1.285 · 10 runs per arm_

| case | with | without | delta |
| --- | --: | --: | --: |
| customer-data | 100% | 0% | +100pp |
| no-over-structure | 100% | 3% | +97pp |
| pr-description | 100% | 12% | +88pp |
| no-sprawl | 92% | 8% | +84pp |
| review-findings | 90% | 16% | +74pp |
| answer-first | 86% | 24% | +62pp |
| task-report | 100% | 40% | +60pp |
| commit-message | 96% | 36% | +60pp |
| no-idioms | 95% | 60% | +35pp |
| sentence-shape | 80% | 80% | +0pp |
| keep-accuracy | 90% | 95% | -5pp |

**4 of 11 cases passed.** Mean delta 60pp.
