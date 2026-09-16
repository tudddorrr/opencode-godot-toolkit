---
name: godot-best-practices
description: Godot 4 best practices for GDScript and scenes. Load before writing, editing, or reviewing any .gd file — gameplay and node trees, but also UI, data classes, Resource/RefCounted types, autoloads, and utility scripts. Distilled from the official Godot best-practices docs.
---

# Godot Best Practices

Godot 4.x. Favor loose coupling, single responsibility, and engine features over hand-rolled equivalents.

## Naming

- Files, folders, GDScript vars/funcs: `snake_case` (C# scripts: `PascalCase`)
- Node names and `class_name` types: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- `const` scene/script references: `PascalCase` (`const MyScene = preload(...)`) — they name types, not values
- snake_case everywhere survives Godot's case-sensitive PCK when exporting

## Scenes vs scripts

- A scene declares a node composition; its root script adds the behavior.
- Game-specific concept (level, character, UI screen) → scene. Reusable, cross-project tool → script.
- `PackedScene.instantiate()` is faster than building the same hierarchy in code with `.new()`/`add_child()` — the engine builds scenes in batches.

## Coupling, references, interfaces

- Aim for scenes with **no external dependencies**. If a scene must reach out, inject from the parent instead of hardcoding paths or grabbing siblings/globals.
- Injection options, safest first: (1) connect to a signal — respond only, past-tense names (`item_collected`); (2) set a `Callable` property; (3) set a `Node`/`Object` reference; (4) set a `NodePath`. Pick the most restrictive that works.
- Siblings must not reference each other; a common ancestor mediates.
- Node access ladder: `@export var child: Node` (fastest; survives moving the node in the editor) → `@onready var child = $Child` → `$Child` → `get_node("Child")` (slowest). Cache once; never `get_node` in a per-frame path.
- `load()` returns the engine's **cached** instance — `duplicate()` or `new()` for a fresh copy.
- The scripting API is duck-typed. Guard dynamic access with `has_method()`, `is`, `is_in_group()`, or `assert()` (note: `assert` is stripped from release exports). Node names and groups act as informal interfaces.

## Autoloads and global state

- Avoid global state. A global manager spreads a bug's origin across the whole project.
- Autoload only a system that (1) tracks all its own data, (2) must be globally accessible, (3) exists in isolation — e.g. a quest or dialogue system.
- Systems that modify other systems' data → regular nodes/scenes, not autoloads.
- Share code with `static func`, state with `static var` (Godot 4.1+) via `class_name`, data via a `Resource` — all avoid an autoload.
- An autoload is **not** a singleton; it's a node auto-added under the root. Get it with `get_node("/root/Name")`.

## Node tree and transforms

- Entry point: `Main` (`main.gd`) → `Node2D/Node3D "World"` + `Control "GUI"`. Swap the World's children to change levels.
- Think relationally, not spatially: a node is a child only if it should be removed with its parent. Otherwise make it a sibling.
- Break an inherited transform by inserting a plain `Node` (declarative) or setting `top_level = true` on a `CanvasItem`/`Node3D`.

## Lifecycle and processing

- Instantiation order: default value (setter not called) → `_init()` (setter called) → exported value from the Inspector (setter called).
- `_init()` builds a subtree in code or does tree-independent setup; `_ready()` runs once all children are ready; `_enter_tree()` when the parent exists but children may not; `_exit_tree()` for cleanup.
- `_process(delta)`: per-frame, framerate-dependent. `_physics_process(delta)`: fixed timestep — use for kinematics and transform updates. Both run every frame, so keep them light.
- `_unhandled_input(event)` (or `_input(event)`): fires only on real input. Prefer over polling `Input` in `_process`.
- Recurring work that needn't run every frame → a `Timer`.
- Set properties **before** `add_child()` — setters can be expensive (procedural generation especially). Exception: `global_position` can only be set once in the tree.
- `preload()` at load time; `load()` at runtime. `const X = load(...)` is an error — constants need `preload()`. Don't `preload()` an `@export` default; the scene/Inspector overwrites it — default to `null`.

## Data structures

- Prefer non-Node types for pure data: `RefCounted` (default), `Resource` (needs serialization / Inspector export), `Object` (manual memory, can dangle).
- Free custom `Object` trees in `NOTIFICATION_PREDELETE`.
- `Array` for ordered/indexed data — `append`/`pop_back` are cheap, inserting or erasing at the front is not.
- `Dictionary` for lookup by key; it preserves insertion order.

## Project layout

- Keep assets near the scenes that use them; split large scenes into smaller reusable ones.
- Third-party code/assets → top-level `addons/` (even non-editor plugins).
- `.gdignore` (empty file, contents ignored, no patterns) stops Godot importing a folder.
