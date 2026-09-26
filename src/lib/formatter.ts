import type { Context } from '@opencode/plugin/promise/plugin'
import { existsSync } from 'fs'
import { homedir } from 'os'
import { isAbsolute, join } from 'path'
import { sessionDirectory } from './directory.js'

const FORMATTER_BIN = 'gdscript-formatter'
const FORMATTING_TOOLS = new Set(['write', 'edit', 'patch'])

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

function filePathFrom(input: unknown) {
  if (typeof input !== 'object' || input === null) {
    return null
  }

  const record = input as Record<string, unknown>

  for (const key of ['path', 'filePath', 'file_path']) {
    const value = record[key]
    if (typeof value === 'string' && value.length > 0) {
      return value
    }
  }

  return null
}

// V2 dropped the config hook, so formatters cannot be registered through
// config anymore. Run the formatter ourselves after the tools that change
// files, mirroring OpenCode's built-in formatter runner (command + $FILE,
// writing in place, output ignored).
export async function registerFormatter(ctx: Context) {
  if (ctx.options['formatter'] === false) {
    return
  }

  const binPath = findFormatterBin()

  // only enable the formatter when the user has it installed
  if (!binPath) {
    return
  }

  await ctx.tool.hook('execute.after', async (event) => {
    if (event.status !== 'completed' || !FORMATTING_TOOLS.has(event.tool)) {
      return
    }

    const file = filePathFrom(event.input)

    if (!file || !file.endsWith('.gd')) {
      return
    }

    const cwd = await sessionDirectory(ctx, event.sessionID)
    const target = isAbsolute(file) ? file : join(cwd, file)

    Bun.spawnSync([binPath, target], {
      cwd,
      stdin: 'ignore',
      stdout: 'ignore',
      stderr: 'ignore',
    })
  })
}
