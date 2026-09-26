import type { Context } from '@opencode/plugin/promise/plugin'
import type { ToolEditor } from '@opencode/plugin/promise/tool'
import { existsSync } from 'fs'
import { join } from 'path'
import { sessionDirectory } from '../lib/directory.js'
import { findGodotBin } from '../lib/godot.js'

function findRunScript(projectRoot: string): string | null {
  const sh = join(projectRoot, 'addons', 'gdUnit4', 'runtest.sh')
  const cmd = join(projectRoot, 'addons', 'gdUnit4', 'runtest.cmd')

  if (process.platform === 'win32' && existsSync(cmd)) {
    return cmd
  }

  if (existsSync(sh)) {
    return sh
  }

  return null
}

// gdUnit4 CLI exit codes -> agent-readable meaning
const EXIT_CODES: Record<number, string> = {
  0: 'passed',
  100: 'test failures or errors',
  101: 'passed, but orphan nodes were detected; free created nodes with auto_free()',
  103: 'headless run blocked; input-driven tests need an editor-enabled run',
  104: 'unsupported Godot version',
  105: 'script errors during test discovery',
}

export function addGdUnitRunTool(editor: ToolEditor, ctx: Context) {
  editor.add({
    name: 'gdunit4_run',
    description:
      'Run gdUnit4 (v6) tests for a Godot project using the gdUnit4 CLI. Use after implementing features, fixing bugs, or modifying GDScript files. USE PROACTIVELY to verify code changes.',
    input: {
      type: 'object',
      properties: {
        paths: {
          type: 'array',
          items: { type: 'string' },
          description:
            "Test suite directories or files to run (e.g. ['res://test/test_foo.gd', 'res://test/core/']). Empty array scans the entire project (res://).",
          default: [],
        },
        ignore: {
          type: 'array',
          items: { type: 'string' },
          description: 'Suites to exclude, by name or as `SuiteName:test_name`.',
          default: [],
        },
        continueOnFailure: {
          type: 'boolean',
          description: 'Continue running after first failure instead of stopping.',
          default: false,
        },
      },
      additionalProperties: false,
    },
    async execute(input, context) {
      const args = (input ?? {}) as {
        paths?: string[]
        ignore?: string[]
        continueOnFailure?: boolean
      }
      const directory = await sessionDirectory(ctx, context.sessionID)
      const script = findRunScript(directory)

      if (!script) {
        return {
          content: 'Error: gdUnit4 not found. Make sure gdUnit4 is installed as an addon.',
        }
      }

      const testPaths = args.paths ?? []
      const ignored = args.ignore ?? []

      const runArgs: string[] = []

      if (testPaths.length > 0) {
        for (const p of testPaths) {
          runArgs.push('-a', p)
        }
      } else {
        runArgs.push('-a', 'res://')
      }

      for (const p of ignored) {
        runArgs.push('-i', p)
      }

      if (args.continueOnFailure) {
        runArgs.push('-c')
      }

      const result = Bun.spawnSync([script, '--godot_binary', findGodotBin(), ...runArgs], {
        cwd: directory,
      })

      const output = [result.stdout.toString(), result.stderr.toString()].filter(Boolean).join('\n')

      const exitCode = result.exitCode ?? -1
      const meaning = EXIT_CODES[exitCode] ?? 'unknown exit code'
      const summary = exitCode === 0 ? '' : `\n\n[gdunit4_run] exit ${exitCode}: ${meaning}`

      return {
        content: (output || '(no output)') + summary,
        metadata: { exitCode },
      }
    },
  })
}
