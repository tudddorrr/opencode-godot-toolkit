import type { Context } from '@opencode/plugin/promise/plugin'
import { readFileSync } from 'fs'

// V2 dropped the config hook and no longer loads config.instructions, so the
// Godot rules file is injected into the system prompt through the session
// context hook instead (the migration target for V1 system prompt edits).
export async function registerInstructions(ctx: Context, rulePath: string) {
  let rules: string

  try {
    rules = readFileSync(rulePath, 'utf-8')
  } catch {
    return
  }

  if (!rules.trim()) {
    return
  }

  await ctx.session.hook('context', (event) => {
    event.system.push({ type: 'text', text: rules })
  })
}
