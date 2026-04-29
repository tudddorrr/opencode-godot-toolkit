import type { Plugin } from '@opencode-ai/plugin'
import { diagnosticsTool } from './tools/diagnostics.js'
import { runTestsTool } from './tools/run-tests.js'

export const GodotToolkitPlugin: Plugin = async () => {
  return {
    tool: {
      gdscript_diagnostics: diagnosticsTool,
      gdunit4_run: runTestsTool,
    },
  }
}

export default GodotToolkitPlugin
