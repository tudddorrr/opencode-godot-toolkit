---
name: gdscript-diagnostics
description: Validate GDScript changes by refreshing Godot cache and checking diagnostics. Use after creating or editing GDScript files. USE PROACTIVELY.
---

# GDScript Diagnostics

Validate GDScript file changes by refreshing Godot's language server cache.

## When to Use

After creating or editing GDScript files (`.gd`):

- **Multiple files**: Run once after editing all files
- **Single file**: Run immediately after editing

## Validation Steps

### Step 1: Refresh Godot Cache

Call the `gdscript_diagnostics` tool:

| Argument      | Type    | Description                                     |
| ------------- | ------- | ----------------------------------------------- |
| `projectRoot` | string? | Path to project.godot directory (auto-detected) |
| `verbose`     | boolean | Show Godot logs (default: false)                |

This runs `godot --headless --import --quit` to update Godot's language server cache. Run this once after editing all files (not per-file).

### Step 2: Check Diagnostics

OpenCode's built-in LSP integration (configured by `opencode-godot-toolkit`) will show updated diagnostics in the editor after the cache refresh.

### Step 3: Review Results

- **Errors** (e.g., `TYPE_MISMATCH`, `UNUSED_PARAMETER`): Fix your code
- **False positives**: If code is correct but shows "wrong argument count" after changing signatures — this resolves when the LSP re-scans (already triggered by the tool)
- **Do not edit** the `.godot/` directory

## Requirements

- Godot Engine on PATH (or `GODOT_PATH` env var)
- `opencode-godot-toolkit` installed for LSP integration
