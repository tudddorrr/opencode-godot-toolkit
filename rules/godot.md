# Godot

This is a Godot 4 project. Use the toolkit skills/tools instead of ad-hoc commands and verify APIs against docs instead of memory.

## GDScript and scenes

Before writing, editing, or reviewing **any** `.gd` file, load the `godot-best-practices` skill. Apply these regardless:

- `snake_case` files, `PascalCase` node and `class_name` types, past-tense signal names
- Cache node refs with `@export`/`@onready`; never `get_node()` in a per-frame path
- `_physics_process` for movement and transforms; `_unhandled_input()` over polling `Input` in `_process`
- Set properties before `add_child()` — except `global_position`, which needs the tree
- `preload()` for constants; `const X = load(...)` is an error
- Signals for child→parent; inject dependencies instead of reaching into siblings or autoloads
- Autoload only for an isolated, self-owned system — otherwise use `static var`/`static func` or a `Resource`
- `RefCounted`/`Resource` over a `Node` for pure data

| Scenario                                                | Use                                          |
| ------------------------------------------------------- | -------------------------------------------- |
| Looking up a class, signal, method, or version behavior | `godot-doc-search` skill                     |
| Writing, editing, or reviewing GDScript or scenes       | `godot-best-practices` skill                 |
| Moving, renaming, or deleting `.gd` files               | `gdscript-file-manager` skill (keeps `.uid`) |
| After editing `.gd` files                               | `gdscript_diagnostics` tool                  |
| Writing tests                                           | `gdunit4-test-writer` skill                  |
| Running tests                                           | `gdunit4_run` tool                           |

Diagnostics need the Godot **editor** running (it hosts the LSP). The formatter is standalone and runs without it.
