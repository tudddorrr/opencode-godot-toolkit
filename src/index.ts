import type { Plugin } from '@opencode-ai/plugin'
import { gdscriptDiagnosticsTool } from './tools/gdscript-diagnostics.js'
import { installGodotToolkitTool } from './tools/install-godot-toolkit.js'
import { runGdUnitTestsTool } from './tools/run-gdunit-tests.js'

export const GodotToolkitPlugin: Plugin = async () => {
  return {
    tool: {
      install_godot_toolkit: installGodotToolkitTool,
      gdscript_diagnostics: gdscriptDiagnosticsTool,
      gdunit4_run: runGdUnitTestsTool,
    },
  }
}

export default { server: GodotToolkitPlugin }
