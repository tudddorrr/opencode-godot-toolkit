import type { Plugin, Config } from '@opencode-ai/plugin'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { registerFormatter } from './lib/formatter.js'
import { gdscriptDiagnosticsTool } from './tools/gdscript-diagnostics.js'
import { runGdUnitTestsTool } from './tools/run-gdunit-tests.js'

type CustomConfig = {
  plugin: Config['plugin']
  skills?: {
    paths?: string[]
  }
  instructions?: string[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = join(__dirname, '..')
const skillsDir = join(pluginRoot, 'skills')
const rulesDir = join(pluginRoot, 'rules')

function registerSkills(config: Config) {
  const cfg = config as CustomConfig

  cfg.skills = cfg.skills ?? {}
  cfg.skills.paths = cfg.skills.paths ?? []

  if (!cfg.skills.paths.includes(skillsDir)) {
    cfg.skills.paths.push(skillsDir)
  }
}

function registerInstructions(config: Config) {
  const cfg = config as CustomConfig

  cfg.instructions = cfg.instructions ?? []

  const rulePath = join(rulesDir, 'godot.md')

  if (!cfg.instructions.includes(rulePath)) {
    cfg.instructions.push(rulePath)
  }
}

function configureLsp(config: Config) {
  // respect LSPs being turned off
  if (config.lsp === false) {
    return
  }

  if (config.lsp?.gdscript) {
    return
  }

  const bridgePath = join(__dirname, 'godot-lsp-bridge.js')

  config.lsp = {
    ...config.lsp,
    gdscript: {
      command: ['node', bridgePath],
      extensions: ['.gd'],
    },
  }
}

export const GodotToolkitPlugin: Plugin = async () => {
  return {
    config: async (config: Config) => {
      registerSkills(config)
      registerInstructions(config)
      registerFormatter(config)
      configureLsp(config)
    },

    tool: {
      gdscript_diagnostics: gdscriptDiagnosticsTool,
      gdunit4_run: runGdUnitTestsTool,
    },
  }
}
