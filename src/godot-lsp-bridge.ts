import { createConnection } from 'node:net'

const socket = createConnection(6008, '127.0.0.1')

socket.on('connect', () => {
  process.stdin.pipe(socket)
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
