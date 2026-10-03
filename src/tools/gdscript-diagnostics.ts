import type { Context } from '@opencode/plugin/promise/plugin'
import type { ToolEditor } from '@opencode/plugin/promise/tool'
import { sessionDirectory } from '../lib/directory.js'
import { findGodotBin, findGodotLspPort, findProjectRoot, isGodotLspRunning } from '../lib/godot.js'

export function addGdscriptDiagnosticsTool(editor: ToolEditor, ctx: Context) {
  editor.add({
    name: 'gdscript_diagnostics',
    description:
      "Refresh Godot Engine's language server cache so OpenCode's built-in LSP shows current diagnostics for .gd files. Run this after creating or editing GDScript files (requires the Godot editor running).",
    input: {
      type: 'object',
      properties: {
        projectRoot: {
          type: 'string',
          description:
            'Path to Godot project root (directory with project.godot). Auto-detected if omitted.',
        },
        verbose: {
          type: 'boolean',
          description: 'Show all Godot log output',
          default: false,
        },
      },
      additionalProperties: false,
    },
    async execute(input, context) {
      const args = (input ?? {}) as { projectRoot?: string; verbose?: boolean }
      const directory = await sessionDirectory(ctx, context.sessionID)
      const root = findProjectRoot(args.projectRoot ?? directory)

      if (!root) {
        return { content: 'Error: project.godot not found. Run from a Godot project directory.' }
      }

      const godot = findGodotBin()
      const result = Bun.spawnSync([godot, '--headless', '--import', '--quit'], { cwd: root })

      const logs = args.verbose
        ? [result.stdout.toString(), result.stderr.toString()].filter(Boolean).join('\n')
        : ''

      if (result.exitCode !== 0) {
        return {
          content: `Error: Godot exited ${result.exitCode}. ${logs || 'Set GODOT_BIN or ensure Godot is in PATH.'}`,
        }
      }

      const port = findGodotLspPort()

      // the editor hosts the LSP, so no editor means no diagnostics
      const status = (await isGodotLspRunning(port))
        ? "OpenCode's LSP diagnostics are now up to date. Check the editor for errors/warnings on your .gd files."
        : `Warning: Godot isn't running on 127.0.0.1:${port}. Start the Godot editor to get diagnostics.`

      return {
        content: [`Cache refreshed for project at: ${root}`, logs, status]
          .filter(Boolean)
          .join('\n'),
      }
    },
  })
}
