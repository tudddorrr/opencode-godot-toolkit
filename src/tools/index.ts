import type { Context } from '@opencode/plugin/promise/plugin'
import { addGdscriptDiagnosticsTool } from './gdscript-diagnostics.js'
import { addGdUnitRunTool } from './run-gdunit-tests.js'

export function registerTools(ctx: Context) {
  return ctx.tool.transform((editor) => {
    addGdscriptDiagnosticsTool(editor, ctx)
    addGdUnitRunTool(editor, ctx)
  })
}
