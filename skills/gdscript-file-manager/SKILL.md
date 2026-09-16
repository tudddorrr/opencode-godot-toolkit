---
name: gdscript-file-manager
description: Move, rename, or delete GDScript files with their .uid files for Godot projects. Use when reorganizing code, renaming scripts, or removing unused GDScript files. USE PROACTIVELY.
---

# GDScript File Manager

Manage `.gd` files together with their `.uid` companions.

## Core principle

Godot generates a `.uid` file per resource. **Always move, rename, and delete the `.gd` and its `.uid` together** — handling one without the other breaks project references.

## Operations

```bash
# move
mv <src>.gd <dest>.gd && mv <src>.gd.uid <dest>.gd.uid

# rename
mv <old>.gd <new>.gd && mv <old>.gd.uid <new>.gd.uid

# delete
rm <file>.gd && rm <file>.gd.uid

# many files at once
for f in components/*.gd; do
	n=$(basename "$f")
	mv "components/$n" "systems/$n" && mv "components/$n.uid" "systems/$n.uid"
done
```

## Notes

- Never create or edit `.uid` files by hand — Godot manages them.
- `mkdir -p` the destination first when moving into a new directory.
- Verify paths with `ls` before operating.
