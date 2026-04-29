---
name: gdscript-file-manager
description: Move, rename, or delete GDScript files with their .uid files for Godot projects. Use when reorganizing code, renaming scripts, or removing unused GDScript files. USE PROACTIVELY.
---

# GDScript File Manager

Manage GDScript files (.gd) along with their corresponding .uid files.

## Core Principle

Godot Engine auto-generates a `.uid` file for each resource. **Always handle .gd and .uid files together.**

## Operations

- **Move**: `mv <source>.gd <dest>.gd && mv <source>.gd.uid <dest>.gd.uid`
- **Rename**: `mv <old>.gd <new>.gd && mv <old>.gd.uid <new>.gd.uid`
- **Delete**: `rm <file>.gd && rm <file>.gd.uid`

## Notes

- Never manually create or edit .uid files - Godot manages them automatically
- Always process both files together to avoid breaking project references
- Verify paths with `ls` before operations
- See examples.md for detailed examples and troubleshooting
