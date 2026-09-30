---
max_turns: 4
allowed_tools: [Skill]
---

Review this function.

```python
import os, json, sys

def get_user(id):
    conn = sqlite3.connect("app.db")
    try:
        cur = conn.execute("SELECT * FROM users WHERE id = " + id)
        row = cur.fetchone()
        if row[3] == 1:
            return row
    except:
        return None
```
