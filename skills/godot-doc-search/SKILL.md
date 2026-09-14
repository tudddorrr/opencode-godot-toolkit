---
name: godot-doc-search
description: Search Godot Engine and GDScript documentation. Use when implementing Godot features, looking up APIs, or finding code examples. USE PROACTIVELY when planning Godot/GDScript implementations.
---

# Godot Docs

Look up Godot Engine API documentation and code examples with the built-in `websearch` and `webfetch` tools.

## Usage

1. `websearch` `site:docs.godotengine.org <query>` to find the right page.
2. `webfetch` the result URL.

Class reference pages have a deterministic URL, so fetch them directly when you know the class:

```
https://docs.godotengine.org/en/stable/classes/class_<classname>.html
```

Examples: `class_area2d.html`, `class_navigationagent2d.html`, `class_configfile.html` (lowercase, no `_` between words).

## Example Queries

| Task                | Search query                                     |
| ------------------- | ------------------------------------------------ |
| Collision detection | `site:docs.godotengine.org Area2D body_entered`  |
| Collectible items   | `site:docs.godotengine.org Area2D collision`     |
| Moving platforms    | `site:docs.godotengine.org AnimatableBody2D`     |
| Enemy pathfinding   | `site:docs.godotengine.org NavigationAgent2D`    |
| Save/load           | `site:docs.godotengine.org ConfigFile save load` |
