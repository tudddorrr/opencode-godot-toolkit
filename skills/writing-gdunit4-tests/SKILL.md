---
name: writing-gdunit4-tests
description: Write or review gdUnit4 (v6) test suites in GDScript. Use when creating, updating, or reviewing tests for GDScript files. USE PROACTIVELY.
---

# Writing gdUnit4 Tests

Requires **gdUnit4 v6.x** (Godot ≥ 4.5).

## Workflow

1. Read the file under test.
2. **Match the project's existing test layout.** Find a nearby `*_test.gd` and follow it — projects differ (one suite per script vs. one per behavior).
3. `extends GdUnitTestSuite`; each case is a function named `test_<name>()`.
4. Run with the `gdunit4_run` tool.

## Traps

These either pass silently or fail the run when handled wrong.

- **`await` every signal assert.** `assert_signal(x).is_emitted(...)` is a coroutine; a missing `await` anywhere in the call chain makes the test pass silently.
- **`auto_free(node)` anything you create.** A leaked node fails the run (exit 101).
- **Prefer typed asserts** (`assert_int`, `assert_str`, `assert_object`, …) over `assert_that()` — better failure messages.
- **`assert_*` does not stop the test.** Guard preconditions with `if is_failure(): return`.
- **`assert_func()` is deprecated** — do not use it.

## Hooks

`before()` / `after()` once per suite; `before_test()` / `after_test()` around each case.

## Mocking

`mock(Class)` with `do_return(value).on(mock).fn(args)`, checked by `verify(mock, times).fn(args)`. `spy(instance)` records calls while running the real code. Argument matchers (`any_int()`, `any_string()`, …) stand in for wildcard args. Mocked/spied objects are auto-freed.

For exact assertion methods, fuzzing, parameterized tests, and the scene runner, fetch the pinned v6 docs: `https://godot-gdunit-labs.github.io/gdUnit4/v6.2.x/` (swap the minor to match `addons/gdUnit4/plugin.cfg`). Use that versioned path — not `/latest/` or the GitHub `master` docs, which may be another major.
