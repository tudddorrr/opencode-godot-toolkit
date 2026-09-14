---
name: godot-doc-search
description: Look up Godot Engine and GDScript documentation for the project's exact Godot version. Use when implementing Godot features, looking up APIs, or finding code examples. USE PROACTIVELY when planning Godot/GDScript implementations.
---

# Godot Docs

Look up Godot Engine API documentation and code examples with the built-in `websearch` and `webfetch` tools.

## 1. Detect the Godot version

Docs are versioned, so target the version the project actually uses. Read `project.godot`:

```
[application]
config/features=PackedStringArray("4.7", "Forward Plus")
```

The first feature string is the version. If unavailable, fall back to the binary: `godot --version` or `"$GODOT_BIN" --version`.

Docs are published per minor release, never per patch, so normalize to `major.minor` before building a URL:

| Detected                        | Use   |
| ------------------------------- | ----- |
| `4.7`                           | `4.7` |
| `4.7.1`                         | `4.7` |
| `4.7.1.stable.official.a13da4f` | `4.7` |

```
printf '%s\n' "$version" | cut -d. -f1-2
```

## 2. Fetch version-specific class pages

Class reference pages have a deterministic URL, so fetch them directly when you know the class:

```
https://docs.godotengine.org/en/<version>/classes/class_<classname>.html
```

For a 4.7 project: `https://docs.godotengine.org/en/4.7/classes/class_area2d.html`.

Class names are lowercase with no `_` between words: `class_area2d.html`, `class_navigationagent2d.html`, `class_configfile.html`.

## 3. Search when unsure

Include the version in the query, then fetch the best result:

```
websearch: site:docs.godotengine.org <version> <topic>
```

## Example Queries

| Task                | Search query                                               |
| ------------------- | ---------------------------------------------------------- |
| Collision detection | `site:docs.godotengine.org <version> Area2D body_entered`  |
| Collectible items   | `site:docs.godotengine.org <version> Area2D collision`     |
| Moving platforms    | `site:docs.godotengine.org <version> AnimatableBody2D`     |
| Enemy pathfinding   | `site:docs.godotengine.org <version> NavigationAgent2D`    |
| Save/load           | `site:docs.godotengine.org <version> ConfigFile save load` |
