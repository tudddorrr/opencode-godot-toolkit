import { tool, type ToolDefinition } from '@opencode-ai/plugin'
import { findGodotBin, findProjectRoot } from '../lib/godot.js'

export const gdscriptDiagnosticsTool: ToolDefinition = tool({
  description:
    "Refresh Godot Engine's language server cache so OpenCode's built-in LSP shows current diagnostics for .gd files. Run this after creating or editing GDScript files.",
  args: {
    projectRoot: tool.schema
      .string()
      .optional()
      .describe(
        'Path to Godot project root (directory with project.godot). Auto-detected if omitted.',
      ),
    verbose: tool.schema.boolean().default(false).describe('Show all Godot log output'),
  },
  async execute(args, ctx) {
    const root = findProjectRoot(args.projectRoot ?? ctx.directory)
    if (!root) {
      return 'Error: project.godot not found. Run from a Godot project directory.'
    }

    const godot = findGodotBin()
    const result = Bun.spawnSync([godot, '--headless', '--import', '--quit'], { cwd: root })

    const logs = args.verbose
      ? [result.stdout.toString(), result.stderr.toString()].filter(Boolean).join('\n')
      : ''

    if (result.exitCode === 0) {
      return [
        `Cache refreshed for project at: ${root}`,
        logs,
        "OpenCode's LSP diagnostics are now up to date. Check the editor for errors/warnings on your .gd files.",
      ]
        .filter(Boolean)
        .join('\n')
    }

    return `Error: Godot exited ${result.exitCode}. ${logs || 'Set GODOT_BIN or ensure Godot is in PATH.'}`
  },
})
