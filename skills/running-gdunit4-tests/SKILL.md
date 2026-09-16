---
name: running-gdunit4-tests
description: Run gdUnit4 (v6) tests for a Godot project and read the results. Use after implementing features, fixing bugs, or modifying GDScript files. USE PROACTIVELY to verify code changes.
---

# Running gdUnit4 Tests

Requires **gdUnit4 v6.x** (Godot ≥ 4.5) — v5 uses different CLI flags.

Run the `gdunit4_run` tool; it wraps `addons/gdUnit4/runtest.sh`. Non-zero exit codes are translated in its output.

- `ignore` takes a **suite name**, or a single case as `SuiteName:test_name` — not a file path.
- Scene-runner input tests receive no `InputEvent` headless. Run them with an editor open, or exclude them (exit 103).
- Reports land in `reports/report_<n>/` — `index.html` (human), `results.xml` (JUnit).
