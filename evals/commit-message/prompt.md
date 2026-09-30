---
max_turns: 4
allowed_tools: [Skill]
---

Write the commit message for this change. Output the message only.

Notes from the session that produced it:

- The upstream API timed out on 41 of 300 calls during last night's batch,
  between 02:00 and 02:40. Outside the batch it timed out on 2 of 1,200.
- With 3 attempts and 1 second of backoff, 9 calls still failed after every
  retry. A local replay with 5 attempts and 2 seconds of backoff got all 41
  through.
- Retrying on every exception also retried HTTP 422 validation errors. Those
  can never succeed, and each one wasted about 7 seconds of retries.
- We tried a circuit breaker first and dropped it: it stopped good calls too.
- `pytest tests/test_retry.py` passes, 12 tests.

```diff
--- a/src/retry.py
+++ b/src/retry.py
@@ -1,5 +1,5 @@
-MAX_ATTEMPTS = 3
-BACKOFF_SECONDS = 1
+MAX_ATTEMPTS = 5
+BACKOFF_SECONDS = 2
@@ -12,7 +12,7 @@ def call_with_retry(fn):
     for attempt in range(MAX_ATTEMPTS):
         try:
             return fn()
-        except Exception:
+        except (TimeoutError, ConnectionError):
             time.sleep(BACKOFF_SECONDS * 2 ** attempt)
```
