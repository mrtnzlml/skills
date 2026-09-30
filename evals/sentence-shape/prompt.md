---
max_turns: 4
allowed_tools: [Skill]
---

Turn these notes into one paragraph for the incident report. Output the
paragraph only.

- Backups were configured to be taken nightly at 02:00 UTC and were stored in
  a bucket that was replicated to a second region, but the replication was
  paused in May during a cost review and was never resumed.
- When the primary region failed on 12 August, it was discovered that the
  latest replicated backup was 94 days old, so the restore could only be done
  from the primary bucket, which was unreachable until the region recovered
  6 hours later.
- It was decided that replication will be monitored by an alert that fires if
  the newest replica is older than 26 hours, and that any pause will require a
  ticket with an end date.
