---
max_turns: 4
allowed_tools: [Skill]
---

Write the PR description for this branch. Output the description only.

Commits:

- Add `--dry-run` flag to the `deploy` command
- Print the plan instead of applying it when `--dry-run` is set
- Add tests for dry-run output
- Update the README usage section
- Rename `apply_plan` to `execute_plan`

Notes from the session:

- Last month two people deployed to production by accident while checking
  what a deploy would change. One incident took 40 minutes to roll back.
- We considered `--plan`, `--preview` and `--what-if` as the flag name. We
  chose `--dry-run` because `terraform` and `kubectl` users already know it.
- The plan output is the same table `deploy` prints before it applies.
- Files changed: `cli/deploy.py`, `core/plan.py`, `tests/test_deploy.py`,
  `README.md`.
- `make test` passes, 214 tests. We ran `deploy --dry-run staging` by hand and
  checked that no resources changed.
- `apply_plan` is also called from `scripts/nightly.py`, which this branch
  updates.
