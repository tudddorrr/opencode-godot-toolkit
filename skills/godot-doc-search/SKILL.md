---
name: godot-doc-search
description: Search Godot Engine and GDScript documentation. Use when implementing Godot features, looking up APIs, or finding code examples. USE PROACTIVELY when planning Godot/GDScript implementations.
---

# Godot Docs

Look up Godot Engine API documentation and code examples using Context7.

Requires: Context7 MCP (`mcp__context7__resolve-library-id`, `mcp__context7__query-docs`) configured in OpenCode.

## Usage

```
mcp__context7__query-docs
  libraryId: "/websites/godotengine_en"
  query: "[what you want to look up]"
```

Use `/websites/godotengine_en` — it has 83,702+ snippets from the official Godot docs.

## Example Queries

| Task                | Query                           |
| ------------------- | ------------------------------- |
| Collision detection | "Area2D body_entered signal"    |
| Collectible items   | "Area2D collision pickup"       |
| Moving platforms    | "AnimatableBody2D platform"     |
| Enemy pathfinding   | "NavigationAgent2D pathfinding" |
| Save/load           | "ConfigFile save load"          |
