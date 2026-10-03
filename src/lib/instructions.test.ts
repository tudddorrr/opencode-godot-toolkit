import type { Context } from '@opencode/plugin/promise/plugin'
import { describe, expect, test } from 'bun:test'
import { join } from 'path'
import { registerInstructions } from './instructions.js'

const rulePath = join(import.meta.dir, '..', '..', 'rules', 'godot.md')

function fakeCtx(options: Record<string, unknown> = {}) {
  let hookName: string | null = null
  let callback: ((event: { system: Array<{ type: string; text: string }> }) => void) | null = null

  const ctx = {
    options,
    session: {
      hook: async (name: string, cb: typeof callback) => {
        hookName = name
        callback = cb
        return { dispose: async () => {} }
      },
    },
  }

  return {
    ctx: ctx as unknown as Context,
    getHook: () => ({ hookName, callback }),
  }
}

describe('registerInstructions', () => {
  test('injects the Godot rules through the session context hook', async () => {
    const { ctx, getHook } = fakeCtx()
    await registerInstructions(ctx, rulePath)

    const { hookName, callback } = getHook()
    expect(hookName).toBe('context')
    expect(callback).not.toBeNull()

    const event = { system: [{ type: 'text', text: 'base' }] }
    callback!(event)

    expect(event.system).toHaveLength(2)
    expect(event.system[1].type).toBe('text')
    expect(event.system[1].text).toContain('# Godot')
  })

  test('registers nothing when the rules file is unreadable', async () => {
    const { ctx, getHook } = fakeCtx()
    await registerInstructions(ctx, '/does/not/exist/godot.md')
    expect(getHook().hookName).toBeNull()
  })
})
