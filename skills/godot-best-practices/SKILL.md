---
name: godot-best-practices
description: Godot Engine best practices for code generation and review. Apply these guidelines when writing, refactoring, or reviewing GDScript code and scene structures. USE PROACTIVELY.
---

# Godot Best Practices

Apply these guidelines when generating or reviewing GDScript code and scene structures.

## Naming Conventions

- **Files/folders**: `snake_case` (avoids case-sensitivity issues on export)
- **GDScript variables/functions**: `snake_case`
- **Node names**: `PascalCase` (matches built-in node casing)
- **class_name types**: `PascalCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **C# scripts**: `PascalCase` (follow C# conventions)

## Scene and Script Structure

- **Scenes** for game-specific concepts (levels, characters, UI screens)
- **Scripts** for reusable tools, editor plugins, or cross-project utilities
- **Scenes + scripts together**: scene declares composition, script adds behavior
- Keep scenes **loosely coupled** — avoid hard references to parent/sibling nodes
- Use **signals** for child-to-parent communication (past-tense names: `health_depleted`, `item_collected`)
- Use **Callable properties** for parent-to-child behavior injection
- Use **`@export` variables** for dependency injection from the editor

## Node Usage

- **Prefer lightweight alternatives** when nodes aren't needed:
  - `Object` for custom data structures
  - `RefCounted` for reference-counted data
  - `Resource` for serializable data (shows in Inspector)
- **Avoid Autoload for shared state** — it creates global dependencies that are hard to debug
- **Use Autoload only** for true singletons that manage their own data (quest system, dialogue system)
- **Each node should have a single responsibility**

## Performance

- **Set properties before adding to scene tree** — avoids triggering setters multiple times
- **`_process(delta)`** — frame-dependent logic, input checks, recurring non-critical logic
- **`_physics_process(delta)`** — consistent timestep, kinematic/transform updates
- **`*_input(event)` callbacks** — prefer over polling `Input` in `_process`
- **Timers** — for recurring logic that doesn't need per-frame execution
- **`preload()`** — for resources that should load with the script (constants)
- **`load()`** — for runtime loading, or when exported value may override

## Data Structures

- **Array** — fast iteration, fast positional access, slow insertion/deletion (use for ordered collections)
- **Dictionary** — fast key-value lookup (constant-time), slower iteration
- **Object/Resource** — when you need signals, properties, or Inspector integration

## Initialization Order

When instantiating scenes, properties set in this order:

1. Default value assignment (no setter called)
2. `_init()` (setter called)
3. Exported value from Inspector (setter called)

Use `_ready()` for logic that needs the full scene tree initialized.
Use `_enter_tree()` for logic when node enters tree (children may not be ready).
Use `NOTIFICATION_PARENTED` for behavior when parented to another node.

## Project Organization

- Group assets near their scenes when possible
- **`addons/`** folder for third-party resources (even non-editor plugins)
- **`.gdignore`** file to prevent Godot from importing a folder
- Keep **case sensitivity** in mind — use `snake_case` to avoid Windows/Linux export issues

## Code Review Checklist

- [ ] Are node names `PascalCase` and file names `snake_case`?
- [ ] Does the scene avoid hard references to external nodes?
- [ ] Are signals used for child-to-parent communication?
- [ ] Are properties set before `add_child()` when possible?
- [ ] Is `_physics_process` used for consistent-timestep logic?
- [ ] Are input callbacks used instead of polling in `_process`?
- [ ] Is Autoload only used for true singletons managing own data?
- [ ] Does each node/script have a single responsibility?
- [ ] Are lightweight types (Object/RefCounted/Resource) used when nodes aren't needed?
