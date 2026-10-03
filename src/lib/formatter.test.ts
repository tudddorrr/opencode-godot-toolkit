import type { Context } from '@opencode/plugin/promise/plugin'
import { describe, expect, test } from 'bun:test'
import { registerFormatter } from './formatter.js'

function fakeCtx(options: Record<string, unknown>) {
  const hooks: string[] = []

  const ctx = {
    options,
    location: { directory: '/tmp' },
    tool: {
      hook: async (name: string) => {
        hooks.push(name)
        return { dispose: async () => {} }
      },
    },
    session: {
      get: async () => ({ location: { directory: '/tmp' } }),
    },
  }

  return { ctx: ctx as unknown as Context, hooks }
}

describe('registerFormatter', () => {
  test('registers no hook when formatting is disabled through options', async () => {
    const { ctx, hooks } = fakeCtx({ formatter: false })
    await registerFormatter(ctx)
    expect(hooks).toHaveLength(0)
  })

  test('registers the execute.after hook when the formatter is available', async () => {
    // force the binary lookup to succeed regardless of the machine
    const original = Bun.which
    Bun.which = (() => '/usr/local/bin/gdscript-formatter') as typeof Bun.which

    try {
      const { ctx, hooks } = fakeCtx({})
      await registerFormatter(ctx)
      expect(hooks).toEqual(['execute.after'])
    } finally {
      Bun.which = original
    }
  })
})
