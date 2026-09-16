# Opencode Godot toolkit

An all-in-one plugin for using Godot with [OpenCode](https://opencode.ai).

This toolkit is designed to help agents write better, more maintainable GDScript code and automate common tasks without being prompted to.

## Features

- **Best practices guidelines** - Ensure code and scenes are correct, efficient and maintainable according to Godot's [best practices advice](https://docs.godotengine.org/en/stable/tutorials/best_practices/index.html).
- **Common task automation** - Skills for automatically searching docs and managing files.
- **LSP** - Auto-configured LSP for GDScript.
- **Formatter** - Auto-configured formatting for `.gd` files.
- **gdUnit4 Integration** - Support for writing and running unit tests.

## Requirements

- Godot Engine 4.x (resolved via `GODOT_BIN` or `PATH`).
- Node.js (runs the GDScript LSP bridge).

## Optional

- [gdUnit4](https://github.com/godot-gdunit-labs/gdUnit4) - If available, agents will write and run unit tests.
- [GDQuest GDScript formatter](https://github.com/GDQuest/GDScript-formatter) - If available (detected via `PATH` or the addon), agents will format `.gd` files.

## Installation

Add the plugin to your config:

```json
{
  "plugin": ["opencode-godot-toolkit"]
}
```

### Verify

- Check for the skills below using `/skills`.
- Check for the tools below using prompts like `find gdscript errors` or `run the unit tests`.

## Skills

- `gdscript-file-manager` - Move/rename/delete `.gd` files with their `.uid` companions.
- `godot-doc-search` - API research based on your project's Godot version.
- `gdscript-diagnostics` - Refresh LSP cache after edits.
- `gdunit4-test-runner` - Run gdUnit4 tests.
- `gdunit4-test-writer` - Write unit tests.
- `godot-best-practices` - Follow best practices when generating/reviewing code.

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

