import { existsSync, readFileSync, readdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

export function findGodotBin() {
  return process.env['GODOT_BIN'] ?? Bun.which('godot') ?? 'godot'
}

function editorSettingsDir() {
  if (process.platform === 'win32') {
    return join(process.env['APPDATA'] ?? join(homedir(), 'AppData', 'Roaming'), 'Godot')
  }

  if (process.platform === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Godot')
  }

  return join(process.env['XDG_CONFIG_HOME'] ?? join(homedir(), '.config'), 'godot')
}

// the editor writes the LSP port to editor_settings-<version>.tres
function findEditorLspPort() {
  const dir = editorSettingsDir()
  if (!existsSync(dir)) {
    return null
  }

  const files = readdirSync(dir).filter(
    (file) => file.startsWith('editor_settings-') && file.endsWith('.tres'),
  )

  for (const file of files.sort().reverse()) {
    const contents = readFileSync(join(dir, file), 'utf-8')
    const match = contents.match(/network\/language_server\/remote_port\s*=\s*(\d+)/)

    if (match) {
      return Number(match[1])
    }
  }

  return null
}

export function findGodotLspPort() {
  return findEditorLspPort() ?? 6005
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
