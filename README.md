# Opencode Godot toolkit

An all-in-one plugin for using Godot with [OpenCode](https://opencode.ai).

This toolkit is designed to help agents write better, more maintainable GDScript code and automate common tasks without being prompted to.

## Features

- **Best practices guidelines** - Ensure code and scenes are correct, efficient and maintainable according to Godot's [best practices advice](https://docs.godotengine.org/en/stable/tutorials/best_practices/index.html), injected into every request.
- **Common task automation** - Skills for automatically searching docs and managing files.
- **LSP** - GDScript LSP bridge (configured once in `opencode.json`, see below).
- **Formatter** - `gdscript-formatter` runs automatically after `.gd` files are changed by the `write`, `edit`, or `patch` tools.
- **gdUnit4 Integration** - Support for writing and running unit tests.

## Requirements

- OpenCode v2 (this package targets the v2 plugin API; use v1.x of this package for OpenCode v1).
- Godot Engine 4.x (resolved via `GODOT_BIN` or `PATH`).
- Node.js (runs the GDScript LSP bridge).

## Optional

- [gdUnit4 (6.x)](https://github.com/godot-gdunit-labs/gdUnit4) - If available, agents will write and run unit tests.
- [GDQuest GDScript formatter](https://github.com/GDQuest/GDScript-formatter) - If available (detected via `PATH` or the addon), `.gd` files are formatted after edits.

## Installation

Add the plugin to your config (replacing the v1 `plugin` array):

```json
{
  "plugins": ["opencode-godot-toolkit"]
}
```

### Configure the GDScript LSP

OpenCode v2 plugins cannot register LSP servers, so the bridge is configured once in your config. The plugin prints the exact line to add on startup (including the absolute path of the installed bridge), and you can disable the hint with the `lspHint` option.

```json
{
  "plugins": ["opencode-godot-toolkit"],
  "lsp": {
    "gdscript": {
      "command": ["node", "node_modules/opencode-godot-toolkit/dist/godot-lsp-bridge.js"],
      "extensions": [".gd"]
    }
  }
}
```

The `command` above works for a project-local install (`bun add -d opencode-godot-toolkit`); otherwise paste the absolute path the plugin logs. Omit this block if you don't want GDScript diagnostics.

### Plugin options

```json
{
  "plugins": [
    {
      "package": "opencode-godot-toolkit",
      "options": {
        "formatter": false,
        "lspHint": false
      }
    }
  ]
}
```

| Option      | Default | Behavior                                                      |
| ----------- | ------- | ------------------------------------------------------------- |
| `formatter` | `true`  | Set `false` to stop running `gdscript-formatter` after edits. |
| `lspHint`   | `true`  | Set `false` to hide the startup hint about the LSP config.    |

### Verify

- Check that `opencode-godot-toolkit` shows up as an active plugin (see `opencode` logs / plugin status).
- Check for the skills below using `/skills`.
- Check for the tools below using prompts like `find gdscript errors` or `run the unit tests`.

## Skills

Registered by the plugin itself at startup:

- `gdscript-file-manager` - Move/rename/delete `.gd` files with their `.uid` companions.
- `godot-doc-search` - API research based on your project's Godot version.
- `gdscript-diagnostics` - Refresh LSP cache after edits.
- `running-gdunit4-tests` - Run gdUnit4 tests.
- `writing-gdunit4-tests` - Write gdUnit4 test suites.
- `godot-best-practices` - Follow best practices when generating/reviewing code.

## Tools

- `gdunit4_run` - Run gdUnit4 tests. Supports paths, ignore patterns, and continue-on-failure.
- `gdscript_diagnostics` - Refresh Godot's LSP cache so diagnostics update for `.gd` files.

## Migrating from v1

- Change `"plugin": ["opencode-godot-toolkit"]` to `"plugins": ["opencode-godot-toolkit"]`.
- Add the `lsp.gdscript` block from above once (v1 registered it automatically).
- Skills, the Godot rules file, and formatting are handled by the plugin again - no `skills`/`instructions`/`formatter` config entries are needed (and v2's `instructions` config is ignored by OpenCode anyway).

## Development

This project uses [Bun](https://github.com/oven-sh/bun).

```bash
bun install
bun run build
bun test
bun run lint
bun run fmt:fix
```
