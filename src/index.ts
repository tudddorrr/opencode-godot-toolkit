import type { Context } from '@opencode/plugin/promise/plugin'
import { Plugin } from '@opencode/plugin'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { registerFormatter } from './lib/formatter.js'
import { registerInstructions } from './lib/instructions.js'
import { registerSkills } from './lib/skills.js'
import { registerTools } from './tools/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = join(__dirname, '..')
const skillsDir = join(pluginRoot, 'skills')
const rulesDir = join(pluginRoot, 'rules')
const bridgePath = join(__dirname, 'godot-lsp-bridge.js')

// V2 plugins cannot register LSP servers: config is no longer mutable. Print
// the exact snippet instead so upgrading V1 users can restore diagnostics.
function logLspHint(ctx: Context) {
  if (ctx.options['lspHint'] === false) {
    return
  }

  console.log(
    [
      '[opencode-godot-toolkit] OpenCode v2 plugins cannot register LSPs, so the GDScript LSP must be configured once in opencode.json:',
      `  "lsp": { "gdscript": { "command": ["node", ${JSON.stringify(bridgePath)}], "extensions": [".gd"] } }`,
      'Set the plugin option "lspHint": false to hide this hint.',
    ].join('\n'),
  )
}

export default Plugin.define({
  id: 'opencode-godot-toolkit',
  async setup(ctx) {
    await registerSkills(ctx, skillsDir)
    await registerInstructions(ctx, join(rulesDir, 'godot.md'))
    await registerFormatter(ctx)
    await registerTools(ctx)
    logLspHint(ctx)
  },
})
