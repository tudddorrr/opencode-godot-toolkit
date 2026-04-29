import { tool, type ToolDefinition } from '@opencode-ai/plugin'
import { existsSync } from 'fs'
import { join } from 'path'

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

export const runTestsTool: ToolDefinition = tool({
  description:
    'Run gdUnit4 tests for a Godot project using the gdUnit4 CLI. Use after implementing features, fixing bugs, or modifying GDScript files. USE PROACTIVELY to verify code changes.',
  args: {
    paths: tool.schema
      .array(tool.schema.string())
      .default([])
      .describe(
        "Test paths to run (e.g. ['res://tests/test_foo.gd', 'res://tests/core/']). Empty array runs all tests under res://tests/.",
      ),
    ignore: tool.schema
      .array(tool.schema.string())
      .default([])
      .describe('Test paths or class names to exclude.'),
    continueOnFailure: tool.schema
      .boolean()
      .default(false)
      .describe('Continue running after first failure instead of stopping.'),
  },
  async execute(args, ctx) {
    const script = findRunScript(ctx.directory)
    if (!script) {
      return 'Error: gdUnit4 not found. Expected addons/gdUnit4/runtest.sh in the project root. Make sure gdUnit4 is installed as an addon.'
    }

    const runArgs: string[] = []
    if (args.paths.length > 0) {
      for (const p of args.paths) {
        runArgs.push('-a', p)
      }
    } else {
      runArgs.push('-a', 'res://tests/')
    }
    for (const p of args.ignore) {
      runArgs.push('-i', p)
    }
    if (args.continueOnFailure) {
      runArgs.push('-c')
    }

    const result = Bun.spawnSync([script, ...runArgs], {
      cwd: ctx.directory,
      env: {
        ...process.env,
        GODOT_BIN: process.env['GODOT_PATH'] ?? process.env['GODOT_BIN'] ?? 'godot',
      },
    })

    const output = [result.stdout.toString(), result.stderr.toString()].filter(Boolean).join('\n')

    // Exit codes: 0 = passed, 100 = failures, 101 = warnings
    return {
      output: output || '(no output)',
      metadata: { exitCode: result.exitCode },
    }
  },
})
