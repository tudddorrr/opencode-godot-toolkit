import { tool, type ToolDefinition } from '@opencode-ai/plugin'
import { findGodotBin, findGodotLspPort, findProjectRoot, isGodotLspRunning } from '../lib/godot.js'

export const gdscriptDiagnosticsTool: ToolDefinition = tool({
  description:
    "Refresh Godot Engine's language server cache so OpenCode's built-in LSP shows current diagnostics for .gd files. Run this after creating or editing GDScript files (requires the Godot editor running).",
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

    if (result.exitCode !== 0) {
      return `Error: Godot exited ${result.exitCode}. ${logs || 'Set GODOT_BIN or ensure Godot is in PATH.'}`
    }

    const port = findGodotLspPort()

    // the editor hosts the LSP, so no editor means no diagnostics
    const status = (await isGodotLspRunning(port))
      ? "OpenCode's LSP diagnostics are now up to date. Check the editor for errors/warnings on your .gd files."
      : `Warning: no Godot editor is running on 127.0.0.1:${port}, so OpenCode cannot show GDScript diagnostics. Start the Godot editor to get them.`

    return [`Cache refreshed for project at: ${root}`, logs, status].filter(Boolean).join('\n')
  },
})
