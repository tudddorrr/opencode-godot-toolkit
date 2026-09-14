import type { Plugin, Config } from '@opencode-ai/plugin'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { gdscriptDiagnosticsTool } from './tools/gdscript-diagnostics.js'
import { runGdUnitTestsTool } from './tools/run-gdunit-tests.js'

type CustomConfig = {
  plugin: Config['plugin']
  skills?: {
    paths?: string[]
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const skillsDir = join(__dirname, '..', 'skills')

function registerSkills(config: Config) {
  const cfg = config as CustomConfig

  cfg.skills = cfg.skills ?? {}
  cfg.skills.paths = cfg.skills.paths ?? []

  if (!cfg.skills.paths.includes(skillsDir)) {
    cfg.skills.paths.push(skillsDir)
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
      configureLsp(config)
    },

    tool: {
      gdscript_diagnostics: gdscriptDiagnosticsTool,
      gdunit4_run: runGdUnitTestsTool,
    },
  }
}
