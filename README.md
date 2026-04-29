# opencode-godot-toolkit

All-in-one plugin for using Godot with [OpenCode](https://opencode.ai). Heavily inspired by [claude-godot-tools](https://github.com/minami110/claude-godot-tools).

## Features

- **LSP Configuration** — Auto-configures Godot Language Server for GDScript support
- **Diagnostics** — `gdscript_diagnostics` tool to refresh LSP cache after file edits
- **gdUnit4 Integration** — `run_tests` tool to run tests
- **File Management** — Skills for managing .gd and .uid files together
- **Doc Search** — Look up Godot API docs via Context7
- **Best Practices** — Skill guiding code generation and review

## Install

Add to your `.opencode/opencode.json`:

```json
{
  "plugin": ["opencode-godot-toolkit"]
}
```

Restart OpenCode. Skills and agents are synced automatically on install.

## Skills

- `gdscript-file-manager` — Move/rename/delete .gd files with their .uid companions
- `godot-doc-search` — API research via Context7 (requires Context7 MCP)
- `gdscript-diagnostics` — Refresh LSP cache after edits
- `gdunit4-test-runner` — Run gdUnit4 tests
- `gdunit4-test-writer` — Write test code with assertions
- `godot-best-practices` — Godot best practices for code generation and review

## Agents

- `@godot-doc-search` — Read-only subagent for Godot documentation lookup
- `@gdunit4-test-runner` — Read-only subagent for running tests

## Requirements

- [OpenCode](https://opencode.ai) installed
- Godot Engine 4.x on PATH (or `GODOT_PATH` env var)
- For doc search: Context7 MCP configured in OpenCode
- For testing: gdUnit4 installed as a Godot addon

## Development

This project uses [Bun](https://github.com/oven-sh/bun).

```bash
bun install
bun run build
bun run typecheck
bun run lint
bun run fmt:fix
```
