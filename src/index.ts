import type { Plugin, Config } from '@opencode-ai/plugin'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
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
const agentsSource = join(__dirname, '..', 'agents')

export const GodotToolkitPlugin: Plugin = async ({ directory }) => {
  return {
    config: async (config: Config) => {
      copyDir(agentsSource, join(directory, '.opencode', 'agents'))
      registerSkillPaths(config, skillsDir)
      configureLsp(config)
    },
    tool: {
      gdscript_diagnostics: gdscriptDiagnosticsTool,
      gdunit4_run: runGdUnitTestsTool,
    },
  }
}

function copyDir(src: string, dest: string) {
  if (!existsSync(src)) {
    return
  }

  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      mkdirSync(dirname(destPath), { recursive: true })
      writeFileSync(destPath, readFileSync(srcPath))
    }
  }
}

function registerSkillPaths(config: Config, dir: string) {
  const cfg = config as CustomConfig

  cfg.skills = cfg.skills ?? {}
  const skills = cfg.skills

  skills.paths = skills.paths ?? []
  const paths = skills.paths

  if (existsSync(dir) && !paths.includes(dir)) {
    paths.push(dir)
  }
}

function configureLsp(config: Config) {
  // respect LSP servers being turned off
  if (config.lsp === false) {
    return
  }

  const lsp = config.lsp ?? {}
  if ('gdscript' in lsp) {
    return
  }

  lsp.gdscript = {
    command: ['nc', 'localhost', '6008'],
    extensions: ['.gd'],
  }

  config.lsp = lsp
}
