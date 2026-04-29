import type { Plugin } from '@opencode-ai/plugin'
import { gdscriptDiagnosticsTool } from './tools/gdscript-diagnostics.js'
import { runGdUnitTestsTool } from './tools/run-gdunit-tests.js'
import { setupGodotToolkitTool } from './tools/setup-godot-toolkit.js'

export const GodotToolkitPlugin: Plugin = async () => {
  return {
    tool: {
      setup_godot_toolkit: setupGodotToolkitTool,
      gdscript_diagnostics: gdscriptDiagnosticsTool,
      gdunit4_run: runGdUnitTestsTool,
    },
  }
}

export default { server: GodotToolkitPlugin }
