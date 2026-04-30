---
name: gdunit4-test-runner
description: Run gdUnit4 tests for Godot projects. Use after implementing features, fixing bugs, or modifying GDScript files. USE PROACTIVELY to verify code changes.
---

# gdUnit4 Test Runner

Run gdUnit4 tests using the `gdunit4_run` tool, which invokes the gdUnit4 CLI (`addons/gdUnit4/runtest.sh`) built into your project.

## Requirements

- gdUnit4 addon installed in your Godot project (`addons/gdUnit4/`)
- Godot Engine on PATH, or `GODOT_BIN` / `GODOT_PATH` env var set

## Test Execution

Call the `gdunit4_run` tool:

| Argument            | Type     | Description                                                                          |
| ------------------- | -------- | ------------------------------------------------------------------------------------ |
| `paths`             | string[] | Test paths to run (e.g. `["res://test/test_foo.gd"]`). Empty = all discovered tests. |
| `ignore`            | string[] | Paths or class names to exclude                                                      |
| `continueOnFailure` | boolean  | Keep running after first failure (default: false)                                    |

## CLI Flags

The tool maps arguments to `runtest.sh` flags:

| Flag              | Argument            | Description                                                     |
| ----------------- | ------------------- | --------------------------------------------------------------- |
| `-a <path>`       | `paths`             | Add a test suite directory or file. Omit to discover all tests. |
| `-c`              | `continueOnFailure` | Continue running after first failure instead of stopping        |
| `--ignore <name>` | `ignore`            | Exclude a test by name or path (can repeat)                     |

## Exit Codes

- **0**: All tests passed
- **100**: Test failures
- **101**: Test warnings

Test reports are saved to `reports/` in your project directory.

To run tests as a dedicated subagent, @mention `@gdunit4-test-runner`.
