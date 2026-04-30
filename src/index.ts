import type { Plugin, Config } from '@opencode-ai/plugin'
import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { gdscriptDiagnosticsTool } from './tools/gdscript-diagnostics.js'
import { runGdUnitTestsTool } from './tools/run-gdunit-tests.js'

type AgentConfig = {
  name: string
  description: string
  permission: {
    edit: 'deny'
  }
}

type CustomConfig = {
  plugin: Config['plugin']
  skills?: {
    paths?: string[]
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const skillsDir = join(__dirname, '..', 'skills')
const promptsDir = join(__dirname, '..', 'prompts')

function readPrompt(name: string): string {
  return readFileSync(join(promptsDir, `${name}.md`), 'utf-8')
}

const agents: AgentConfig[] = [
  {
    name: 'gdunit4-test-runner',
    description:
      'Run gdUnit4 tests for Godot projects. USE PROACTIVELY after implementing features or fixing bugs.',
    permission: {
      edit: 'deny',
    },
  },
  {
    name: 'godot-doc-search',
    description:
      'Search Godot Engine and GDScript documentation. USE PROACTIVELY when planning Godot/GDScript implementations.',
    permission: {
      edit: 'deny',
    },
  },
]

function registerSkills(config: Config, dir: string) {
  const cfg = config as CustomConfig

  cfg.skills = cfg.skills ?? {}
  cfg.skills.paths = cfg.skills.paths ?? []

  if (existsSync(dir) && !cfg.skills.paths.includes(dir)) {
    cfg.skills.paths.push(dir)
  }
}

function registerAgents(config: Config) {
  agents.forEach((agentConfig) => {
    if (!config.agent) {
      config.agent = {}
    }

    config.agent[agentConfig.name] = {
      description: agentConfig.description,
      mode: 'subagent',
      permission: agentConfig.permission,
      prompt: readPrompt(agentConfig.name),
    }
  })
}

function configureLsp(config: Config) {
  if (config.lsp === false) return

  const lsp = config.lsp ?? {}

  if ('gdscript' in lsp) return

  lsp.gdscript = {
    command: ['nc', 'localhost', '6005'],
    extensions: ['.gd'],
  }

  config.lsp = lsp
}

export const GodotToolkitPlugin: Plugin = async () => {
  return {
    config: async (config: Config) => {
      registerSkills(config, skillsDir)
      registerAgents(config)
      configureLsp(config)
    },

    tool: {
      gdscript_diagnostics: gdscriptDiagnosticsTool,
      gdunit4_run: runGdUnitTestsTool,
    },
  }
}
