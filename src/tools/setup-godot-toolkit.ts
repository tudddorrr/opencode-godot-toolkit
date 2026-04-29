import { tool, type ToolDefinition } from '@opencode-ai/plugin'
import { existsSync, cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'

type LSPConfig = {
  command: string[]
  extensions: string[]
}

type OpenCodeConfig = {
  lsp?: Record<string, LSPConfig>
}

function findPackageRoot(from: string): string | null {
  let dir = from

  for (let i = 0; i < 20; i++) {
    const candidate = join(dir, 'node_modules', 'opencode-godot-toolkit')

    if (existsSync(candidate)) {
      return candidate
    }

    const parent = dirname(dir)
    if (parent === dir) {
      break
    }

    dir = parent
  }

  return null
}

function syncTo(target: string, source: string): string[] {
  if (!existsSync(source)) {
    return []
  }

  const items = readdirSync(source, { withFileTypes: true })
  const copied: string[] = []

  mkdirSync(target, { recursive: true })

  for (const item of items) {
    const src = join(source, item.name)
    const dest = join(target, item.name)
    if (item.isDirectory()) {
      cpSync(src, dest, { recursive: true, force: true })
      copied.push(`${item.name}/`)
    } else {
      cpSync(src, dest, { force: true })
      copied.push(item.name)
    }
  }

  return copied
}

function configureLsp(opencodeDir: string) {
  mkdirSync(opencodeDir, { recursive: true })
  const configPath = join(opencodeDir, 'opencode.json')
  let config: OpenCodeConfig = {}

  const lspConfig = {
    command: ['nc', 'localhost', '6005'],
    extensions: ['.gd'],
  }

  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'))
    } catch {
      return false
    }
  }

  if (!config.lsp || typeof config.lsp !== 'object') {
    config.lsp = {}
  }

  const lsp = config.lsp
  if (lsp.gdscript) {
    return false
  }

  lsp.gdscript = lspConfig
  writeFileSync(configPath, JSON.stringify(config, null, '\t') + '\n')

  return true
}

export const setupGodotToolkitTool: ToolDefinition = tool({
  description:
    'Set up the Godot toolkit for this project by syncing skills, agents, and LSP config into the .opencode directory. Run this once after adding the opencode-godot-toolkit plugin to your opencode.json. Do NOT run npm install - the plugin must already be installed.',
  args: {
    projectRoot: tool.schema
      .string()
      .optional()
      .describe(
        'Path to the project root where .opencode/ will be populated. Defaults to the current working directory.',
      ),
  },
  async execute(args, ctx) {
    const root = args.projectRoot ?? ctx.directory
    const opencodeDir = join(root, '.opencode')

    const packageRoot = findPackageRoot(root)
    if (!packageRoot) {
      return 'Error: Could not locate opencode-godot-toolkit package. Make sure it is installed in node_modules.'
    }

    const skillsSource = join(packageRoot, 'skills')
    const agentsSource = join(packageRoot, 'agents')

    const skillsTarget = join(opencodeDir, 'skills')
    const agentsTarget = join(opencodeDir, 'agents')

    const skillsCopied = syncTo(skillsTarget, skillsSource)
    const agentsCopied = syncTo(agentsTarget, agentsSource)
    const lspConfigured = configureLsp(opencodeDir)

    if (skillsCopied.length === 0 && agentsCopied.length === 0 && !lspConfigured) {
      return 'No skills or agents found to install. The package may be corrupted.'
    }

    const lines = ['Godot toolkit installed successfully!', '']

    if (skillsCopied.length > 0) {
      lines.push(`Skills → ${skillsTarget}`)
      for (const s of skillsCopied) lines.push(`  - ${s}`)
    }

    if (agentsCopied.length > 0) {
      lines.push(`Agents → ${agentsTarget}`)
      for (const a of agentsCopied) lines.push(`  - ${a}`)
    }

    if (lspConfigured) {
      lines.push(`LSP → Configured gdscript language server in .opencode/opencode.json`)
    } else {
      lines.push(`LSP → gdscript already configured in .opencode/opencode.json, skipping`)
    }

    return lines.join('\n')
  },
})
