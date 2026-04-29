import { tool, type ToolDefinition } from '@opencode-ai/plugin'
import { existsSync, cpSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'

function findPackageRoot(from: string): string | null {
  let dir = from
  for (let i = 0; i < 20; i++) {
    const candidate = join(dir, 'node_modules', 'opencode-godot-toolkit')
    if (existsSync(candidate)) {
      return candidate
    }
    const parent = dirname(dir)
    if (parent === dir) break
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

export const installGodotToolkitTool: ToolDefinition = tool({
  description:
    "Install the Godot toolkit's skills and agent configs into the project's .opencode directory. Run this once after adding the plugin to set up skill files and agent definitions.",
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

    if (skillsCopied.length === 0 && agentsCopied.length === 0) {
      return 'No skills or agents found to install. The package may be corrupted.'
    }

    const lines: string[] = ['Godot toolkit installed successfully!', '']

    if (skillsCopied.length > 0) {
      lines.push(`Skills → ${skillsTarget}`)
      for (const s of skillsCopied) lines.push(`  - ${s}`)
    }

    if (agentsCopied.length > 0) {
      lines.push(`Agents → ${agentsTarget}`)
      for (const a of agentsCopied) lines.push(`  - ${a}`)
    }

    return lines.join('\n')
  },
})
