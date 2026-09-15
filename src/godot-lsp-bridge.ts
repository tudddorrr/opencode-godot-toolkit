import { createConnection } from 'node:net'
import { findGodotLspPort } from './lib/godot.js'
import { createFrameRewriter } from './lib/lsp.js'

const port = findGodotLspPort()
const socket = createConnection(port, '127.0.0.1')

socket.on('connect', () => {
  const rewrite = createFrameRewriter((data) => socket.write(data))

  process.stdin.on('data', rewrite)
  process.stdin.on('end', () => socket.end())
  socket.pipe(process.stdout)
})

socket.on('error', (err) => {
  console.error(`[godot-lsp-bridge] ${err.message}`)
  process.exit(1)
})

socket.on('close', () => {
  process.exit(0)
})

const shutdown = () => {
  socket.end()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
