import type { Context } from '@opencode/plugin/promise/plugin'

type SessionGetInput = Parameters<Context['session']['get']>[0]

// ctx.location is where this plugin instance loaded, not where a session lives.
// Tools that need a working directory (project detection, test runs, formatting)
// read the session's own location instead.
export async function sessionDirectory(ctx: Context, sessionID: SessionGetInput['sessionID']) {
  try {
    const session = await ctx.session.get({ sessionID })
    return session.location.directory
  } catch {
    return ctx.location.directory
  }
}
