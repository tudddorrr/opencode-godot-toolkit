# opencode-godot-toolkit

All-in-one plugin for using Godot with [OpenCode](https://opencode.ai). Heavily inspired by [claude-godot-tools](https://github.com/minami110/claude-godot-tools).

## Features

- **Best practices & helpers** - Ensure generated code is correct and follows best practices. Automates common tasks like searching docs and managing files.
- **LSP** - Auto-configured LSP for GDScript.
- **gdUnit4 Integration** - Support for writing and running tests.

## Requirements

- Godot Engine 4.x (resolved via `GODOT_BIN` or `PATH`).
- For doc search: [Context7](https://github.com/upstash/context7) MCP configured in OpenCode.
- For testing: gdUnit4 installed as a Godot addon.

## Installation

Add the plugin to your config:

```json
{
  "plugin": ["opencode-godot-toolkit"]
}
```

### Verify

- Check for the skills below using `/skills`.
- Check for the agents below using `@`.
- Check for the tools below using a prompt like `look for gdscript errors` or `run the unit tests`.

## Skills

- `gdscript-file-manager` - Move/rename/delete `.gd` files with their .uid companions.
- `godot-doc-search` - API research via Context7.
- `gdscript-diagnostics` - Refresh LSP cache after edits.
- `gdunit4-test-runner` - Run gdUnit4 tests.
- `gdunit4-test-writer` - Write unit tests.
- `godot-best-practices` - Follow best practices when generating/reviewing code.

## Agents

- `@godot-doc-search` - Read-only subagent for Godot documentation lookup.
- `@gdunit4-test-runner` - Read-only subagent for running tests.

## Tools

- `gdunit4_run` - Run gdUnit4 tests. Supports paths, ignore patterns, and continue-on-failure.
- `gdscript_diagnostics` - Refresh Godot's LSP cache so diagnostics update for `.gd` files.

## Development

This project uses [Bun](https://github.com/oven-sh/bun).

```bash
bun install
bun run build
bun run lint
bun run fmt:fix
```
