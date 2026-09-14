import type { Config } from '@opencode-ai/plugin'
import { existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const FORMATTER_BIN = 'gdscript-formatter'

// Godot's per-user cache dir (EditorPaths.get_cache_dir())
function godotCacheDir() {
  if (process.platform === 'win32') {
    return join(process.env.LOCALAPPDATA ?? homedir(), 'Godot')
  }

  if (process.platform === 'darwin') {
    return join(homedir(), 'Library', 'Caches', 'Godot')
  }

  return join(process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'), 'godot')
}

function findFormatterBin() {
  const onPath = Bun.which(FORMATTER_BIN)
  if (onPath) {
    return onPath
  }

  const exe = process.platform === 'win32' ? `${FORMATTER_BIN}.exe` : FORMATTER_BIN

  // the add-on installs the binary into its cache dir, not onto PATH
  const installedByAddon = join(godotCacheDir(), 'gdquest', exe)

  if (existsSync(installedByAddon)) {
    return installedByAddon
  }

  return null
}

export function registerFormatter(config: Config) {
  // respect formatters being turned off
  if (config.formatter === false) {
    return
  }

  const existing =
    typeof config.formatter === 'object' && config.formatter !== null ? config.formatter : {}

  if (existing[FORMATTER_BIN]) {
    return
  }

  const binPath = findFormatterBin()

  // only enable the formatter when the user has it installed
  if (!binPath) {
    return
  }

  config.formatter = {
    ...existing,
    [FORMATTER_BIN]: {
      command: [binPath, '$FILE'],
      extensions: ['.gd'],
    },
  }
}
