import { existsSync } from 'fs'
import { join } from 'path'

export function findGodotBin() {
  return process.env['GODOT_BIN'] ?? Bun.which('godot') ?? 'godot'
}

export function findProjectRoot(from: string) {
  if (existsSync(join(from, 'project.godot'))) {
    return from
  }

  const result = Bun.spawnSync(
    ['find', '.', '-maxdepth', '4', '-name', 'project.godot', '-type', 'f'],
    { cwd: from },
  )

  const found = result.stdout.toString().trim().split('\n')[0]
  if (!found) {
    return null
  }

  return join(from, found.replace(/\/project\.godot$/, ''))
}
